require.config({
    deps: ["./myApp/js/main"],
    baseUrl: '',
    paths: {
        jquery: './assets/vendor/jquery/jquery-1.11.2.min',
        underscore: './assets/vendor/underscore/underscore-1.8.2',
        backbone: './assets/vendor/backbone/backbone-1.1.2.min',
        bootstrap: './assets/vendor/bootstrap/js/bootstrap.min',
        tpl: './assets/vendor/tpl',
        text: './assets/vendor/text',
        tpls: './myApp/tpls',
        collection: './myApp/src/Collections',
        model: './myApp/src/Models',
        view: './myApp/src/Views',
        router: './myApp/src/Controllers',
        utils: './myApp/js/utils'
    },
    shim: {
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        bootstrap: {
            deps: ["jquery"]
        }
    }
});