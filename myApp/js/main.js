require(['jquery', 'backbone', 'router/MainRouter', 'tpl'],
        function($, Backbone, MainRouter, tpl) {
            $(function() {
                init_myrouter();
            });
            function pageload() {
                init_myrouter();
            }
            var _router = null;
            function init_myrouter() {
                if (typeof String.prototype.trim !== 'function') {
                    String.prototype.trim = function() {
                        return this.replace(/^\s+|\s+$/g, '');
                    };
                }
                if (!_router && MainRouter) {
                    _router = new MainRouter();
                    Backbone.history.start();
//                    Backbone.history.loadUrl(Backbone.history.fragment);
                }
            }

        });

