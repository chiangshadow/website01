define(['jquery', 'backbone', 'utils/utility'], function($, Backbone, Utility) {

    var PageModel = Backbone.Model.extend({
        defaults: {
            lang: listLang.en,
            page: "main",
            subpage: 0
        }
    });
    return PageModel;
});