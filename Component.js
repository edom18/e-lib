(function (win, doc, Class, ns) {

    'use strict';

    var Component = EventDispatcher.extend({
        init: function () {
            //
        },
        _add: function (cmp) {
            this._children || (this._children = []);
            this._children.push(cmp);
        },
        addChild: function (cmp) {
            if (cmp.parent) {
                cmp.remove();
            }
            this._add(cmp);
        },
        removeChild: function (cmp) {
            var children = this._children;

            for (var i = 0, l = children.length; i < l; i++) {
                if (children[i] === cmp) {
                    children.splice(i, 1);
                    break;
                }
            }
        },
        remove: function () {
            this.parent.removeChild(this);
        }
    });

    /*! ---------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */
    ns.Component = Component;

}(window, window.document, window.Class, window));
