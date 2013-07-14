(function (win, doc, util, Component, ns) {
    'use strict';

    var base_name = 'view-',
        index_id  = 0;

    var View = Component.extend({
        mineSelector: '&',
        tagName: 'div',
        className: 'view-component',
        init: function (args) {

            var attribute = args || {};

            util.copyClone(this, attribute);
            this._overrideProps(attribute);

            //setting this view's id.
            this.id = (attribute.id) ? attribute.id : (base_name + index_id++);
            this.el = attribute.el || this._createElement();
            this.el.viewObject = this;
            this._setEvents();

            this.model = attribute.model;

            if (attribute.html) {
                this.html(attribute.html);
            }

            //called `initialize` function if that exist on attributes.
            if (util.isFunction(this.initialize)) {
                this.initialize.apply(this, arguments);
            }
        },

        /*! --------------------------------------------------------------
            PRIVATE METHODS.
        ------------------------------------------------------------------*/
        _overrideProps: function (attribute) {
            if (attribute.tagName) {
                this.tagName = attribute.tagName;
            }
            if (attribute.className) {
                this.className = attribute.className;
            }
            if (attribute.events) {
                if (this.events) {
                    util.copyClone(this.events, attribute.events, true);
                }
                else {
                    this.events = attribute.events;
                }
            }
            if (
                util.isFunction(attribute.initialize) &&
                attribute.initialize !== this.initialize
            ) {

                var tmpFunc1 = this.initialize || function () {},
                    tmpFunc2 = attribute.initialize;

                this.initialize = function () {
                    tmpFunc1.apply(this, arguments);
                    tmpFunc2.apply(this, arguments);
                };
            }
        },

        /*! --------------------------------------------------------------
            PUBLIC METHODS.
        ------------------------------------------------------------------*/
        html: function (html) {
            var node = util.makeHTMLNode(html);
            this.append(node);
        },

        /**
         * Set styles to the element.
         * @param {string|Object} styles
         */
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
         * Set attributes to the element.
         * @param {string|Object} attributes
         */
        attr: function (attributes) {
            if (arguments.length === 2) {
                attributes = {};
                attributes[arguments[0]] = arguments[1];
            }

            for (var name in attributes) {
                this.el.setAttribute(name, attributes[name]);
            }
        },

        /**
         * add class name to the `this.el`.
         * @param {string} className
         */
        addClass: function (className) {
            if (this.el.classList) {
                this.el.classList.add(className);
            }
            else {
                var classes = this.el.className;
                var class_obj = classes.split(/\s+/);
                for (var i = 0, l = class_obj.length; i < l; i++) {
                    if (class_obj[i] === className) {
                        return false;
                    }
                }

                class_obj.push(className);
                this.el.className = class_obj.join(' ');
            }
        },

        /**
         * remove class name from the `this.el`
         * @param {string} className
         */
        removeClass: function (className) {
            if (this.el.classList) {
                this.el.classList.remove(className);
            }
            else {
                var classes = this.el.className;
                var class_obj = classes.split(/\s+/);
                for (var i = 0, l = class_obj.length; i < l; i++) {
                    if (class_obj[i] === className) {
                        class_obj.splice(i, 1);
                        break;
                    }
                }

                this.el.className = class_obj.join(' ');
            }
        },

        /**
         * Append element to the `this.el`.
         * @param {Element} node
         */
        append: function (node) {
            this.el.appendChild(node);
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

            if (this.model) {
                this.model.dispose();
                this.model = null;
            }

            this.initialize = null;
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
        
            /**
             * Actual event handler.
             * @param {Event} e
             */
            function _innerHandler(e) {
                var res, evt, els;

                if (target === that.mineSelector) {
                    els = [el];
                }
                else {
                    els = [].slice.call(el.querySelectorAll(target));
                }

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

                    var handle_obj = this.events[target][name];

                    if (util.isObject(handle_obj)) {
                        handler = handle_obj.handler;
                        capture = handle_obj.capture || false;
                    }
                    else if (util.isString(handle_obj)) {
                        handler = this[handle_obj];
                    }
                    else {
                        handler = handle_obj;
                    }

                    this._setEvent(name, target, handler, capture);
                    handle_obj = null;
                }
            }
        },

        /**
         * Create a base element.
         */
        _createElement: function () {
            var el = doc.createElement(this.tagName);
            el.id = this.id;
            el.className = this.className;
            return el;
        }
    });

    /*! ---------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */
    ns.View = View;

}(window, document, util, window.Component, window));
