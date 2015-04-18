define(['jquery', 'underscore', 'backbone', 'text!tpls/header.html', 'utils/utility', 'bootstrap'], function($, _, Backbone, tplHeader, Utility) {

    var HeaderView = Backbone.View.extend({
        t_header: _.template(tplHeader),
        el: ".header",
        initialize: function(options) {
            _.bindAll(this, "render", "resize");

            this.resize();
            $(window).resize(this.resize);

            this.on('afterRender', this.afterRender);

            var self = this;
            this.mainView = options.mainView;
            this.controller = options.controller;
            this.pageModel = options.pageModel;
            this.model = options.model;
            this.collection = options.collection;
        },
        render: function() {
            var data = {models: this.collection.toJSON(), lang: Utility.enumGetKey(listLang, this.collection.lang)};

            //header
            $(this.el).html(this.t_header(data));

            this.trigger('afterRender');
        },
        afterRender: function() {
        },
        //bind
        resize: function() {
            var self = this;
        },
        events: {
            "click a.list-cmd": "com_cmd"
        },
        com_cmd: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $t = $(e.target);
            if (e.type === "click") {
                if ($t.attr("data-action") === "click-type") {
                    var _id = $t.parent("li:eq(0)").attr("data-id");
                    var _model = this.collection.get(_id).toJSON();
                    this.model.set(_model, {silent: true});
                    this.pageModel.set({"page": _id, "subpage": _model.seletedCnt}, {silent: true});
                    var _pageM = this.pageModel.toJSON();
                    this.controller.navigate(this.controller.create_action_link(_pageM), {trigger: true});
                }
            }
        },
        modelChanged: function(m) {
            var o = m.toJSON();
        }
        //methods
        //accessors

    });
    return HeaderView;
});
