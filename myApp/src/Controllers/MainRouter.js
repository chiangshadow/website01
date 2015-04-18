define(['jquery', 'underscore', 'backbone', 'model/PageModel', 'view/MainView', 'utils/utility'], function($, _, Backbone, PageModel, MainView, Utility) {

    var mainRouter = Backbone.Router.extend({
        routes: {
            "": "linkItems",
            ":lang": "linkItems",
            ":lang/:page": "linkItems",
            ":lang/:page/:subpage": "linkItems"
        },
        initialize: function(options) {
            this.view = null;
            this.pageModel = new PageModel();
        },
        linkItems: function(lang, page, subpage) {
            var self = this;
            var _pageModelDefaults = this.pageModel.defaults;

            if (!!!lang && !!!page && !!!subpage) {
                this.navigate(this.create_action_link(_pageModelDefaults), {trigger: false});
                this.pageModel.set(_pageModelDefaults, {silent: true});
            }

            //lang
            if (!!!listLang[lang] && listLang[lang] !== 0) {
                this.navigate(this.create_action_link({"lang": _pageModelDefaults.lang}), {trigger: false});
                this.pageModel.set({"lang": _pageModelDefaults.lang}, {silent: true});
            } else {
                this.pageModel.set({"lang": listLang[lang]}, {silent: true});
            }

            this.pageModel.set({"page": page, "subpage": subpage}, {silent: true});

            if (!!!this.view || (!!this.view && this.view.collection.lang !== this.pageModel.get("lang"))) {
                if (this.view !== null && this.view.remove !== null) {
                    this.view.cleanup();
                }
                this.view = new MainView({lang: this.pageModel.get("lang"), controller: this, pageModel: this.pageModel});
            } else if (!!this.view && !!this.view.contentView) {
                this.view.contentView.viewPage(this.pageModel.get("page"), this.pageModel.get("subpage"));
                this.view.contentView.goToByScrollAnimate(this.pageModel.get("page"));
            }
        },
        //methods        
        create_action_link: function(options) {
            var opt = this.pageModel.toJSON();
            var _default = this.pageModel.defaults;
            if (!!options)
                _.extend(opt, options);

            var _lang = opt.hasOwnProperty("lang") && typeof opt["lang"] === 'number' ? Utility.enumGetKey(listLang, opt["lang"]) : Utility.enumGetKey(listLang, listLang["en"]);
            var _page = opt.hasOwnProperty("page") ? opt["page"] : _default.page;
            var _subpage = opt.hasOwnProperty("subpage") ? opt["subpage"] : _default.subpage;

            return "#" + _lang + '/' + _page + '/' + _subpage;
        }
    });
    return mainRouter;
});