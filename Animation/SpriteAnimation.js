(function (win, doc, EventDispatcher, ns) {

    'use strict';

    //Import
    var addClass = util.addClass,
        removeClass = util.removeClass;


    /**
     * Sprite renderer's base class.
     */
    var SpriteRenderer = Class.extend({
        $class: 'SpriteRenderer',
        render: util.nullFunction
    });

    var SpriteClassNameRenderer = SpriteRenderer.extend({
        $class: 'SpriteClassNameRenderer',

        /** @override */
        render: function (animation, isLoop) {

            removeClass(animation.el, animation.baseName + animation.index);

            animation.index += animation.dir;

            addClass(animation.el, animation.baseName + animation.index);

            if (animation.index === animation.length) {
                if (!isLoop) {
                    if (!animation.fillMode) {
                        removeClass(animation.el, animation.baseName + animation.index);
                    }

                    animation.ended = true;
                }
                else {

                    removeClass(animation.el, animation.baseName + animation.index);

                    if (animation.alternative) {
                        animation.dir = -1;
                    }
                    else {
                        animation.index = 1;
                    }
                }
            }
            else if (animation.index === 1 && animation.alternative) {
                animation.dir = 1;
            }
        }
    });

    var SpriteFileRender = SpriteRenderer.extend({
        $class: 'SpriteFileRender',

        /** @override */
        render: function (animation, isLoop) {

            animation.el.style.backgroundImage = 'url(' + animation.baseName + animation.index + '.' + animation.fileType + ')';
            animation.index += animation.dir;

            if (animation.index === animation.length) {
                if (!isLoop) {
                    if (!animation.fillMode) {
                        animation.el.style.backgroundImage = 'url(' + animation.baseName + 1 + '.' + animation.fileType + ')';
                    }

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
        }
    });

    /**
     * Player class
     * @class
     */
    var SpriteAnimation = EventDispatcher.extend({
        $class: 'SpriteAnimation',

        isLoop: false,

        init: function (targets, isLoop, useFile) {

            if (!util.isArray(targets)) {
                targets = [targets];
            }

            this.isLoop = isLoop ? true : false;
            this.animations = [];

            if (useFile) {
                this.renderer = new SpriteFileRender();
            }
            else {
                this.renderer = new SpriteClassNameRenderer();
            }

            for (var i = 0, l = targets.length; i < l; i++) {
                this.animations.push(util.copyClone({
                    dir: 1,
                    index: 1,
                    prevTime: 0,
                    interval: 1000,
                    alternative: false,
                    fillMode: false
                }, targets[i], true));
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
            var render = this.renderer.render;

            (function loop() {

                var now = +new Date();
                var animation = null;

                for (var i = 0; i < len; i++) {
                    animation = animations[i];

                    if (animation.ended) {
                        continue;
                    }

                    if (now - animation.prevTime > animation.interval) {
                        render(animation, isLoop);
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
