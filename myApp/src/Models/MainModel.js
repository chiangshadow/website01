define(['jquery', 'backbone'], function($, Backbone) {

    var MainModel = Backbone.Model.extend({
        initialize: function() {
        },
        defaults: {
            id: null,
            title: null,
            tbcolor: null,
            subtitles: [],
            contents: [],
            contentbgs: [],
            seletedCnt: 0,
            backgroudimg: null
        },
        idAttribute: "id",
        validate: function(attrs) {
            var errors = [];
            return errors.length > 0 ? errors : false;
        }
    });
    return MainModel;
});