define(['jquery', 'underscore', 'backbone', 'model/MainModel', 'collection/MainCollection', 'view/HeaderView', 'view/ContentView', 'utils/utility', 'bootstrap'], function($, _, Backbone, MainModel, MainCollection, HeaderView, ContentView, Utility) {

    var MainView = Backbone.View.extend({
        el: "#mainWrap",
        initialize: function(options) {
            _.bindAll(this, "modelChanged", "render", "resize", "cleanup");

            this.resize();
            $(window).resize(this.resize);

            this.on('render', this.afterRender);

            var self = this;
            this.controller = options.controller;

            this.pageModel = options.pageModel;

            this.model = new MainModel();
            this.model.on("change", this.modelChanged);

            this.headerView = null;
            this.contentView = null;

            this.collection = new MainCollection();
            this.collection.lang = options.lang;
            this.collection.fetch({
                contentType: "application/json",
                success: function(c) {
                    //header
                    self.headerView = new HeaderView({mainView: self, controller: self.controller, pageModel: self.pageModel, model: self.model, collection: c});
                    self.headerView.render();

                    //content             
                    self.contentView = new ContentView({mainView: self, controller: self.controller, pageModel: self.pageModel, model: self.model, collection: c});
                    self.contentView.render();
                },
                error: function() {
                },
                reset: true
            });
        },
        render: function() {
        },
        afterRender: function() {
        },
        //bind
        resize: function() {
        },
        modelChanged: function(m) {
            var o = m.toJSON();
        },
        cleanup: function() {
            var _domCenterWrap = $(this.el).children("#centerWrap");
            //header
            this.headerView.remove();
            _domCenterWrap.length ? _domCenterWrap.append('<div class="header"></div>') : null;
//            this.headerView.undelegateEvents();
//            $(this.headerView.el).empty();

            //Content
            this.contentView.remove();
            var _domHeader = _domCenterWrap.children(".header");
            _domHeader.length ? _domHeader.after('<div class="contain"></div>') : null;
//            this.contentView.undelegateEvents();
//            $(this.contentView.el).empty();

            //unbind            
            $(window).unbind("scroll");
        }
        //accessors

    });
    return MainView;
});
