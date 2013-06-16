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

        css: function (styles) {
            if (arguments.length === 2) {
                styles = {};
                styles[arguments[0]] = arguments[1];
            }

            for (var name in styles) {
                this.el.style[name] = styles[name];
            }
        },

        /**
         * Append to the target.
         * @param {View|Element} target
         */
        appendTo: function (target) {
            if (target instanceof View) {
                target = target.el;
            }
            target.appendChild(this.el);
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
        remove: function () {
            this._super();
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
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

            this.el = null;
        },

        /** @override */
        on: function (typ, fnc, context) {
             var target;

             if (util.isString(fnc)) {
                 typ = arguments[0];
                 fnc = arguments[2];
                 target  = arguments[1];
                 context = arguments[3];

                 this._setEvent(typ, target, fnc, false, context);
             }
             else {
                 this._super.apply(this, arguments);
             }
        },

        render: util.nullFunction,

        /*! ----------------------------------------------------------------
            PRIVATE METHODS.
        -------------------------------------------------------------------- */
        /**
         * Set dom event as delegator.
         * @param {string} name An event name.
         * @param {string} target Targets css selector.
         * @param {Function} handler An event handler.
         * @param {boolean} capture capture phase boolean.
         * @param {Function} context Context function.
         */
        _setEvent: function (name, target, handler, capture, context) {

            var that = this,
                el   = this.el,
                domHandlers = this._domHandlers || (this._domHandlers = []);
        
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
                    handler.call((context || that), evt);
                    evt = null;
                }
            }

            //registor this handler.
            domHandlers.push([name, _innerHandler, capture]);

            //attach event to the `el`.
            el.addEventListener(name, _innerHandler, capture);
        },

        /**
         * Set events by this.events.
         */
        _setEvents: function () {
            if (!this.events) {
                return;
            }

            var handler, capture;

            for (var target in this.events) {
                for (var name in this.events[target]) {
                    handler = null;
                    capture = false;

                    if (util.isObject(this.events[target][name])) {
                        handler = this.events[target][name].handler;
                        capture = this.events[target][name].capture || false;
                    }
                    else {
                        handler = this.events[target][name];
                    }

                    this._setEvent(name, target, handler, capture);
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
