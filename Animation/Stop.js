(function (win, doc, Sequence, ns) {

    'use strict';

    /**
     * Stop an animation.
     * Resume animation when `end` has been invoked.
     */
    var Stop = Sequence.extend({
        $class: 'Stop',

        /** @override */
        update: function (timeStep) {
            //do nothing.
        }
    });

    /*! -----------------------------------------
        EXPORTS
    --------------------------------------------- */
    ns.Stop = Stop;

}(window, window.document, window.Sequence, window));
