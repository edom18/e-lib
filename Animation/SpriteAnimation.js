(function (win, doc, EventDispatcher, ns) {

    'use strict';

    //Import
    var addClass = util.addClass,
        removeClass = util.removeClass;

    /**
     * Player class
     * @class
     */
    var SpriteAnimation = EventDispatcher.extend({
        $class: 'SpriteAnimation',

        init: function (targets, isLoop) {

            if (!util.isArray(targets)) {
                targets = [targets];
            }

            this.isLoop = isLoop ? true : false;
            this.animations = [];

            for (var i = 0, l = targets.length; i < l; i++) {
                this.animations.push({
                    el: targets[i].el,
                    dir: 1,
                    index: 1,
                    prevTime: 0,
                    baseName: targets[i].baseName,
                    length: targets[i].length,
                    interval: targets[i].interval || 1000,
                    alternative: targets[i].alternative ? true : false
                });
            }
        },

        /**
         * Start sprite animation.
         */
        start: function () {

            var that = this;

            var prevTime = +new Date();
            var animations = this.animations;
            var len = animations.length;
            var isLoop = this.isLoop;

            (function loop() {

                var now = +new Date();
                var animation = null;

                for (var i = 0; i < len; i++) {
                    animation = animations[i];

                    if (animation.ended) {
                        continue;
                    }

                    if (now - animation.prevTime > animation.interval) {
                        removeClass(animation.el, animation.baseName + animation.index);

                        animation.index += animation.dir;

                        addClass(animation.el, animation.baseName + animation.index);

                        if (animation.index === animation.length) {
                            if (!isLoop) {
                                removeClass(animation.el, animation.baseName + animation.index);
                                animation.ended = true;
                            }
                            if (animation.alternative) {
                                animation.dir = -1;
                            }
                            else {
                                animation.index = 1;
                            }
                        }
                        else if (animation.index === 1 && animation.alternative) {
                            animation.dir = 1;
                        }

                        animation.prevTime = now;
                    }
                }

                for (var i = 0; i < len; i++) {
                    if (!animations[i].ended) {
                        that.timer = setTimeout(loop, 32);
                        return;
                    }
                }

                that.trigger('end');
            }());
        },

        stop: function () {
            clearTimeout(this.timer);
        },

        dispose: function () {
            this._super();

            this.stop();
            this.animations = null;
        }
    });

    /*! -----------------------------------------
        EXPORTS
    --------------------------------------------- */
    ns.SpriteAnimation = SpriteAnimation;

}(window, window.document, window.EventDispatcher, window));
