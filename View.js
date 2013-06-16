(function (EventDispatcher, util, ns) {
    'use strict';

    var base_name = 'view-',
        index_id  = 0;

    var View = Class.extend({
        className: 'view-component',
        init: function (args) {

            var attribute = args || {};

            //setting this model's id.
            this.id = (attribute.id) ? attribute.id : (base_name + index_id++);
            this.el = attribute.el || this._createElement();
            this._setEvents(this.el);

            this.model = attribute.model;

            //called `initialize` function if that exist on attributes.
            if (util.isFunction(this.initialize)) {
                this.initialize.apply(this, arguments);
            }
        },

        _setEvents: function (el) {
            if (!this.events) {
                return;
            }

            for (var target in this.events) {
                    for (var name in this.events[target]) {
                        (function (that, target) {
                            var handler = that.events[target][name].handler,
                                capture = that.events[target][name].capture || false,
                                els = null;

                            el.addEventListener(name, function (e) {

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
                            }, capture);
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
