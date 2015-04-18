define(['jquery', 'backbone', 'model/MainModel', 'utils/utility'], function($, Backbone, MainModel, Utility) {
    var Mainlist = Backbone.Collection.extend({
        model: MainModel,
        lang: listLang.en,
        url: function() {
            return './data/' + Utility.enumGetKey(listLang, this.lang) + '/website.json';
        },
        initialize: function() {
        },
        updateCollection: function(model, silent) {
            this.forEach(function(m, i) {
                if (m.get('id') === model.id) {
                    m.set(model, {silent: true});
                    return false;
                }
            }, {silent: silent});
            return this;
        }
    });
    return Mainlist;
});
