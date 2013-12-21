(function (win, doc, Sequence, ns) {

    'use strict';

    var animationNamePrefix = 'animation-',
        animationCnt = 0;

    var Animation = Sequence.extend({
        $class: 'Animation',
        isSubAnimation: false,
        started: false,
        loop: null,

        init: function (step, delay, opt) {

            opt || (opt = {});

            this._super();
            this.step = step;
            this.delay = delay ? delay : 0;

            this.name = opt.name || (animationNamePrefix + (++animationCnt));
            this.userData = opt.userData;

            if (delay) {
                this.running = false;
            }

            if (opt.asSubAnimation) {
                this.isSubAnimation = true;
            }

            if (opt.standalone) {
                this.loop = new Loop(util.bind(this.loopStep, this));
                this.loop.start();
            }
        },

        /**
         * Run as standalone.
         * @param {number} timeStep
         */
        loopStep: function (timeStep) {
            this.update(timeStep);
        },

        /** @override */
        softStop: function () {
            if (this.isSubAnimation) {
                return;
            }

            this._super();
        },

        /** @override */
        update: function (timeStep) {

            if (this.linking) {
                return;
            }

            if (!this.linking && !this.ended && this.delay <= 0) {
                this.step && this.step(timeStep, this.pastTime);
            }

            if (this.delay > 0) {
                this.delay -= timeStep;
                return;
            }

            if (!this.started) {
                this.started = true;
                this.trigger('willstart');
            }

            this._super(timeStep);
        },

        /** @override */
        end: function () {
            this._super();

            if (this.loop) {
                this.loop.dispose();
                this.loop = null;
            }
        }
    });

    /**
     * Create animation as a holder.
     * @return {Animation}
     */
    Animation.createHolder = function (name) {
        return new Animation(null, 0, {name: name || ''});
    };

    /*! -----------------------------------------
        EXPORTS
    --------------------------------------------- */
    ns.Animation = Animation;

}(window, window.document, window.Sequence, window));
