(function (win, doc, Class, ns) {

    'use strict';

    var Component = EventDispatcher.extend({
        _add: function (cmp) {
            this.children || (this.children = []);
            this.children.push(cmp);
            cmp.parent = this;
        },

        /**
         * Add a component.
         * @param {Component} cmp
         */
        addChild: function (cmp) {
            if (cmp.parent) {
                cmp.remove();
            }
            this._add(cmp);
        },

        /**
         * Remove a component.
         * @param {Component} cmp
         */
        removeChild: function (cmp) {
            var children = this.children;

            for (var i = 0, l = children.length; i < l; i++) {
                if (children[i] === cmp) {
                    children.splice(i, 1);
                    break;
                }
            }
        },

        /**
         * Remove this component from the parent.
         */
        remove: function () {
            if (this.parent) {
                this.parent.removeChild(this);
                this.parent = null;
            }
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
        },

        /** @override */
        dispose: function () {
            this._super();

            if (this.children) {
                for (var i = 0, l = this.children.length; i < l; i++) {
                    this.children[i].dispose();
                }
                this.children = null;
            }

            this.remove();
        }
    });

    /*! ---------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */
    ns.Component = Component;

}(window, window.document, window.Class, window));
