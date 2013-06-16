(function (win, doc, Class, ns) {

    'use strict';

    var Component = EventDispatcher.extend({
        _add: function (cmp) {
            this.children || (this.children = []);
            this.children.push(cmp);
            cmp.parent = this;
        },
        addChild: function (cmp) {
            if (cmp.parent) {
                cmp.remove();
            }
            this._add(cmp);
        },
        removeChild: function (cmp) {
            var children = this.children;

            for (var i = 0, l = children.length; i < l; i++) {
                if (children[i] === cmp) {
                    children.splice(i, 1);
                    break;
                }
            }
        },
        remove: function () {
            this.parent.removeChild(this);
        },

        /** @override */
        trigger: function (typ, opt_evt) {

            (opt_evt || (opt_evt = {})).currentTarget = this;

            if (!opt_evt.target) {
                opt_evt.target = this;
            }

            this._super(typ, opt_evt);

            if (this._bubbleCanceled) {
                this._bubbleCanceled = false;
                return;
            }

            if (this.parent) {
                this.parent.trigger(typ, opt_evt);
            }
        }

    });

    /*! ---------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */
    ns.Component = Component;

}(window, window.document, window.Class, window));
