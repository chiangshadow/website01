define(['jquery', 'underscore', 'backbone', 'text!tpls/main.html', 'utils/utility', 'bootstrap'], function($, _, Backbone, tplMain, Utility) {

    var HeaderView = Backbone.View.extend({
        t_main: _.template(tplMain),
        el: ".contain",
        initialize: function(options) {
            _.bindAll(this, "modelChanged", "render", "viewPage", "liCarousel_click", "resize", "windowScrollScreen");

            this.resize();
            $(window).resize(this.resize);

            this.on('afterRender', this.afterRender);

            var self = this;
            this.mainView = options.mainView;
            this.controller = options.controller;
            this.pageModel = options.pageModel;
            this.model = options.model;
            this.collection = options.collection;

            $("#centerWrap .contain").delegate("li", "click", this.liCarousel_click);
        },
        render: function() {
            var data = {models: this.collection.toJSON(), lang: Utility.enumGetKey(listLang, this.collection.lang)};

            //content
            $(this.el).html(this.t_main(data));

            this.trigger('afterRender');
        },
        afterRender: function() {
            var self = this;
            var secImgsHeight = {};
            var loadedImg = 0;
            var _divCarouselBgs = $(".divCarouselBg");
            $("img.imgCarousel").load(function() {
                loadedImg++;

                //collection img heights
                var _sec = $(this).parents("section:eq(0)").attr("id");
                if (Object.keys(secImgsHeight).indexOf(_sec) < 0) {
                    secImgsHeight[_sec] = [];
                }

                //change it to background img
                var _divCarouselBg = $(this).siblings(".divCarouselBg:eq(0)");
                var _cssBg = {"background-image": 'url(' + $(this).attr("src") + ')', "height": this.height};
                _divCarouselBg.css(_cssBg);
                $(this).remove();

                secImgsHeight[_sec].push(Utility.toInt(_divCarouselBg.css("height").replace("px", "")));

                //loaded total imgs
                if (loadedImg === _divCarouselBgs.length) {
                    // Cache selectors
                    self.lastId = null;
                    var topMenu = $("#top-menu");
                    self.topMenuHeight = topMenu.outerHeight();
                    $(".header").css("height", self.topMenuHeight + "px");
                    // All list items
                    self.menuItems = topMenu.find("a");
                    // Anchors corresponding to menu items
                    self.scrollItems = self.menuItems.map(function() {
                        var item = $($(this).attr("href"));
                        if (item.length) {
                            return item;
                        }
                    });

                    $(window).bind("scroll", self.windowScrollScreen);

                    var _pageM = self.pageModel.toJSON();
                    self.viewPage(_pageM.page, _pageM.subpage);
                    self.goToByScroll(self.model.get("id"));
                }

            });
        },
        //bind
        resize: function() {
            var self = this;
        },
        events: {
            "click a.list-cmd": "com_cmd"
        },
        liCarousel_click: function(e) {
            var $t = $(e.target);
            var _pageM = this.pageModel.toJSON();
            _pageM.page = $t.attr("data-target").slice(1);
            _pageM.subpage = $t.index();
            this.controller.navigate(this.controller.create_action_link(_pageM), {trigger: false});
            this.pageModel.set(_pageM, {silent: true});

            var _model = this.collection.get(_pageM.page).toJSON();
            _model.seletedCnt = _pageM.subpage;
            this.model.set(_model, {silent: true});

            //update collection
            this.collection.updateCollection(_model, true);

            this.goToByScrollAnimate(_pageM.page);
        },
        modelChanged: function(m) {
            var o = m.toJSON();
        },
        //methods
        viewPage: function(page, subpage) {
            var self = this, _model = {}, _pages = [];
            var _pageModelDefaults = this.pageModel.defaults;

            //page                    
            if (this.collection.models.length > 0) {
                _pages = _.map(this.collection.models, function(o) {
                    return _.pick(o, 'id').id;
                });
                _pageModelDefaults.page = _pages[0];
            }

            if (!!Utility.toStr(page)) {
                page = Utility.toStr(page).toLowerCase();
                var validpage = _.some(_pages, function(p) {
                    return p === page;
                });
                if (!(_pages.length > 0) || (_pages.length > 0 && !validpage))
                    page = _pageModelDefaults.page;
            } else {
                page = _pageModelDefaults.page;
            }
            this.controller.navigate(this.controller.create_action_link({"page": page}), {trigger: false});
            this.pageModel.set({"page": page}, {silent: true});

            _model = this.collection.get(this.pageModel.get("page")).toJSON();

            //header set selected

            //subpage
            if (_model.contents.length > 0 && _.isNumber(Utility.toInt(subpage)) && (!!Utility.toInt(subpage) || Utility.toInt(subpage) === 0)) {
                subpage = Utility.toInt(subpage);
                if (!(_model.contents.length > 0) || (_model.contents.length > 0 && (_model.contents.length) <= subpage))
                    subpage = _pageModelDefaults.subpage;
            } else {
                subpage = _pageModelDefaults.subpage;
            }
            this.controller.navigate(this.controller.create_action_link({"subpage": subpage}), {trigger: false});
            this.pageModel.set({"subpage": subpage}, {silent: true});

            _model.seletedCnt = this.pageModel.get("subpage");

            this.model.set(_model, {silent: true});

            $('#' + this.model.get("id")).carousel(this.model.get("seletedCnt"));

            //update collection
            this.collection.updateCollection(_model, true);

//            this.goToByScrollAnimate(this.model.get("id"));
        },
        windowScrollScreen: function(e) {
            var $t = $(e.target);

            // Get container scroll position
            var fromTop = $t.scrollTop() + this.topMenuHeight;

            // Get id of current scroll item
            var cur = this.scrollItems.map(function() {
                if ($(this).offset().top <= fromTop)
                    return this;
            });
            // Get the id of the current element
            cur = cur[cur.length - 1];
            var id = cur && cur.length ? cur[0].id : "";

            if (this.lastId !== id) {
                this.lastId = id;
                // Set/remove active class
                var _activePage = this.menuItems.parent().removeClass("active").end().filter("[href=#" + id + "]");
                if (_activePage.length) {
                    _activePage.parent().addClass("active");

                    var _model = this.collection.get(id).toJSON();
                    var _cntsLen = _model.contents.length;

                    var _pageM = this.pageModel.toJSON();
                    _pageM.page = id;
                    _pageM.subpage = _cntsLen < _pageM.subpage ? _pageM.subpage : _model.seletedCnt;
                    this.controller.navigate(this.controller.create_action_link(_pageM), {trigger: false});

                    this.pageModel.set(_pageM, {silent: true});
                }
            }
        },
        goToByScrollAnimate: function(id) {
            var offsetTop = $("#" + id).offset().top - this.topMenuHeight + 1;
            $('html, body').stop().animate({scrollTop: offsetTop});
        },
        goToByScroll: function(id) {
            var offsetTop = $("#" + id).offset().top - this.topMenuHeight + 1;
            $(window).scrollTop(offsetTop);
        }
        //accessors

    });
    return HeaderView;
});
