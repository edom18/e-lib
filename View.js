(function (EventDispatcher, util, ns) {
    'use strict';

    var base_name = 'view-',
        index_id  = 0;

    var View = Component.extend({
        className: 'view-component',
        init: function (args) {

            var attribute = args || {};

            //setting this view's id.
            this.id = (attribute.id) ? attribute.id : (base_name + index_id++);
            this.el = attribute.el || this._createElement();
            this._setEvents();

            this.model = attribute.model;

            //called `initialize` function if that exist on attributes.
            if (util.isFunction(this.initialize)) {
                this.initialize.apply(this, arguments);
            }
        },

        /** @override */
        addChild: function (view) {
            this._super.apply(this, arguments);
            this.el.appendChild(view.el);
        },

        /** @override */
        removeChild: function (view) {
            this._super.apply(this, arguments);
            this.el.removeChild(view.el);
        },

        /** @override */
        dispose: function () {
            this._super();

            var el = this.el;

            if (this._domHandlers) {
                for (var i = 0, l = this._domHandlers.length, handler; i < l; i++) {
                    handler = this._domHandlers[i];
                    el.removeEventListener(handler[0], handler[1], handler[2]);
                }
                this._domHandlers = null;
            }

            this.el.parentNode.removeChild(this.el);
            this.el = null;
        },

        render: util.nullFunction,

        /*! ----------------------------------------------------------------
            PRIVATE METHODS.
        -------------------------------------------------------------------- */
        _setEvents: function () {
            if (!this.events) {
                return;
            }

            var domHandlers = this._domHandlers || (this._domHandlers = []),
                el = this.el;

            for (var target in this.events) {
                    for (var name in this.events[target]) {
                        (function (that, target) {
                            var handler = that.events[target][name].handler,
                                capture = that.events[target][name].capture || false,
                                els = null;

                            function _innerHandler(e) {
                                var res, evt, els;

                                els = [].slice.call(el.querySelectorAll(target));
                                for (var i = 0, l = els.length; i < l; i++) {
                                    res = els[i].compareDocumentPosition(e.target);
                                    if (!(res === 0 || res & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
                                        continue;
                                    }
                                    evt = new EventObject(e, {
                                        originalEvent: e
                                    });
                                    evt.currentTarget = els[i];
                                    handler.call(that, evt);
                                    evt = null;
                                }
                            }

                            //registor this handler.
                            domHandlers.push([name, _innerHandler, capture]);

                            //attach event to the `el`.
                            el.addEventListener(name, _innerHandler, capture);
                        }(this, target));
                    }
            }
        },

        /**
         * Create a base element.
         */
        _createElement: function () {
            var el = document.createElement('div');
            el.id = this.id;
            el.className = this.className;
            return el;
        }
    });

    /*! ---------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */
    ns.View = View;

}(EventDispatcher, util, window));
