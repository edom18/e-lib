(function (win, doc, Sequence, ns) {

    'use strict';

    var Flow = Sequence.extend({
        $class: 'Flow',
        priorityChildNum: 0,
        endedPriorityChildNum: 0,
        priorityMode: false,
        priorityStart: false,
        init: function () {
            this._super();
            this.priorityChildren = [];
        },

        /** @override */
        endChild: function () {
            this.endedChildNum++;
            if (this.endedChildNum === this.childNum && !this.priorityMode) {
                this.end();
            }
        },

        /**
         * Add a priority sequence object.
         * @param {Sequence} seq
         */
        addPriority: function (seq) {
            this.priorityChildren.push(seq);
            this.priorityChildNum++;

            seq.on('end', this.endPriorityChild, this);
            this.softStop();

            if (this.priorityMode) {
                return;
            }

            this.priorityMode = true;

            var runningAnimations = [];
            for (var i = 0, l = this.childNum; i < l; i++) {
                if (this.children[i].running) {
                    runningAnimations.push(this.children[i]);
                }
            }

            var len = runningAnimations.length;
            function runningEnd() {
                --len || (this.priorityStart = true);
            }

            if (len !== 0) {
                for (var i = 0, l = runningAnimations.length; i < l; i++) {
                    runningAnimations[i].on('end', runningEnd, this);
                    runningAnimations[i].on('softEnd', runningEnd, this);
                }
            }
            else {
                this.priorityStart = true;
            }
        },

        /** @override */
        getAnimationsByName: function (name) {

            var result;

            result = this._super(name);

            for (var i = 0, l = this.priorityChildren.length; i < l; i++) {
                if (this.children[i].name === name) {
                    result.push(this.priorityChildren[i]);
                }
            }

            return result;
        },

        getPriorityAnimations: function () {
            return util.makeArr(this.priorityChildren);
        },

        endPriorityChild: function () {
            this.endedPriorityChildNum++;

            if (this.endedPriorityChildNum === this.priorityChildNum) {
                this.priorityMode = false;

                if (this.endedChildNum === this.childNum) {
                    this.end();
                }
                else {
                    this.resumeSoftStop();
                }
            }
        },

        isPriority: function () {
            return this.priorityMode;
        },

        /** @override */
        update: function (timeStep) {
            this._super(timeStep);

            if (this.priorityMode && this.priorityStart) {
                for (var i = 0,l = this.priorityChildNum; i < l; i++) {
                    this.priorityChildren[i].update(timeStep);
                }
            }
        }
    });

    /*! -----------------------------------------
        EXPORTS
    --------------------------------------------- */
    ns.Flow = Flow;

}(window, window.document, window.Sequence, window));
