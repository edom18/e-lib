(function(win, doc, EventDispatcher, ns) {

    'use strict';

    var PreLoader = EventDispatcher.extend({
        $class: 'PreLoader',
        urls: null,
        images: null,

        init: function (urls) {
            this.urls = [];
            this.images = [];

            urls && this.add(urls);
        },

        add: function (urls) {

            if (!util.isArray(urls)) {
                urls = [urls];
            }

            this.urls = this.urls.concat(urls);
        },

        load: function () {

            var img = null;
            var len = this.urls.length;
            var that = this;

            function _loaded() {
                --len || that.loaded();
            }

            for (var i = 0, l = this.urls.length; i < l; i++) {
                img = new Image();
                img.onload = _loaded;
                img.src = this.urls[i];
            }
        },

        loaded: function () {
            this.trigger('load');
        }
    });

    /*! -----------------------------------------
        EXPORTS
    --------------------------------------------- */
    ns.PreLoader = PreLoader;

})(window, window.document, window.EventDispatcher, window);
