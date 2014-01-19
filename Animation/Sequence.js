(function (win, doc, EventDispatcher, ns) {

    'use strict';

    var Sequence = EventDispatcher.extend({
        $class: 'Sequence',
        endedChildNum: 0,
        childNum: 0,
        children: null,
        linkCnt: 0,
        linking: false,
        running: false,
        pastTime: 0,
        init: function () {
            this.children = [];
            this.running = true;
        },

        /** @override */
        dispose: function () {
            this._super();

            this.stop();
            for (var i = 0; i < this.childNum; i++) {
                this.children[i].dispose();
            }

            this.children = null;
            this.childNum = 0;
            this.endedChildNum = 0;
            this.parent = null;
        },

        /**
         * Clear the animation and remove children.
         */
        clear: function () {
            for (var i = 0; i < this.childNum; i++) {
                this.children[i].dispose();
            }

            this.children = [];
            this.childNum = 0;
            this.endedChildNum = 0;
        },

        /**
         * Stop an animation restrictly.
         */
        stop: function () {
            this.stoped = true;

            if (this.childNum) {
                for (var i = 0, l = this.childNum; i < l; i++) {
                    this.children[i].stop();
                }
            }
        },

        /**
         * Resume an animation.
         */
        resume: function () {
            this.stoped = false;

            if (this.childNum) {
                for (var i = 0, l = this.childNum; i < l; i++) {
                    this.children[i].resume();
                }
            }
        },

        /**
         * Stop an animation.
         */
        softStop: function () {
            this.softStoped = true;

            if (this.childNum) {
                for (var i = 0, l = this.childNum; i < l; i++) {
                    this.children[i].softStop();
                }
            }
        },

        /**
         * Resume a soft stop animation.
         */
        resumeSoftStop: function () {
            this.softStoped = false;

            if (this.childNum) {
                for (var i = 0, l = this.childNum; i < l; i++) {
                    this.children[i].resumeSoftStop();
                }
            }
        },

        /**
         * Add a sequence object.
         * @param {Sequence} seq
         */
        add: function (seq) {

            if (!util.isArray(seq)) {
                seq = [seq];
            }

            for (var i = 0, l = seq.length; i < l; i++) {
                this.childNum++;
                this.children.push(seq[i]);

                if (this.softStoped) {
                    seq[i].running = false;
                    seq[i].softStoped = true;
                }

                seq[i].parent = this;
                seq[i].on('end', this.endChild, this);
            }
        },

        /**
         * Return animations by name.
         * @param {string} name
         */
        getAnimationsByName: function (name) {
            var result = [];

            for (var i = 0, l = this.children.length; i < l; i++) {
                if (this.children[i].name === name) {
                    result.push(this.children[i]);
                }
            }

            return result;
        },

        endChild: function () {
            this.endedChildNum++;
            if (this.endedChildNum === this.childNum) {
                this.end();
            }
            if (this.softStoped && !this.ended) {
                for (var i = 0, l = this.childNum; i < l; i++) {
                    if (this.children[i].running) {
                        return;
                    }
                }

                this.trigger('softEnd');
            }
        },

        /**
         * Update a sequence.
         * @param {number} timeStep
         */
        update: function (timeStep) {
            if (this.stoped) {
                return;
            }

            if (this.linking || this.ended) {
                return;
            }

            if (!this.running && this.softStoped) {
                return;
            }

            this.pastTime += timeStep;

            if (this.childNum) {
                for (var i = 0, l = this.childNum; i < l; i++) {
                    if (this.ended) {
                        break;
                    }
                    this.children[i].update(timeStep);
                }
            }
        },

        /**
         * Contect to a sequence object.
         * @param {Sequence} seq
         */
        linkTo: function (seq) {
            this.running = false;
            this.linking = true;
            this.linkCnt++;

            seq.on('end', this.linkEnd, this);
        },

        linkEnd: function () {
            if (--this.linkCnt) {
                return;
            }
            
            this.linking = false;

            if (!this.softStoped) {
                this.running = true;
            }
        },

        /**
         * End of the animation.
         */
        end: function (data) {

            if (this.ended) {
                return;
            }

            this.ended = true;
            this.running = false;

            this.clear();
            this.children = null;
            this.trigger('willend', data);
            this.trigger('end', data);
        }
    });

    /*! -----------------------------------------
        EXPORTS
    --------------------------------------------- */
    ns.Sequence = Sequence;

}(window, window.document, window.EventDispatcher, window));
