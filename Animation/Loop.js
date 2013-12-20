(function (win, doc, EventDispatcher, ns) {

    'use strict';

    /**
     * Loop class
     * @class
     */
    var Loop = EventDispatcher.extend({
        $class: 'Loop',
        interval: 16,

        init: function (step, interval) {
            if (interval != null) {
                this.interval = interval;
            }
            this.step = step;
        },

        /**
         * Start loop.
         */
        start: function () {

            var that = this;
            var prevTime = +new Date();
            var interval = this.interval;
            var step = this.step;

            (function loop() {

                that.requestId = requestAnimFrame(loop);

                var now = +new Date();
                var stepTime = now - prevTime;

                if (stepTime > interval) {
                    step(stepTime);
                    prevTime = now;
                }
            }());
        },

        stop: function () {
            cancelAnimFrame(this.requestId);
        },

        dispose: function () {
            this._super();
            this.stop();
        }
    });

    /*! -----------------------------------------
        EXPORTS
    --------------------------------------------- */
    ns.Loop = Loop;

}(window, window.document, window.EventDispatcher, window));
