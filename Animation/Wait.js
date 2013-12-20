(function (win, doc, Sequence, ns) {

    'use strict';

    var Wait = Sequence.extend({
        $class: 'Wait',
        init: function (waitTime) {
            this._super();
            this.waitTime = waitTime;
        },

        /** @override */
        update: function (timeStep) {
            if (this.ended || this.linking) {
                return;
            }

            this.waitTime -= timeStep;

            if (this.waitTime <= 0) {
                this.end();
            }
        }
    });

    /*! -----------------------------------------
        EXPORTS
    --------------------------------------------- */
    ns.Wait = Wait;

}(window, window.document, window.Sequence, window));
