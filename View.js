(function (EventDispatcher, util, ns) {
    'use strict';

    var base_name = 'view-',
        index_id  = 0;

    var View = Class.extend({
        className: 'view-component',
        init: function (args, opt) {

            var attribute = args || {};

            //setting this model's id.
            this.id = (attribute.id) ? attribute.id : (base_name + index_id++);
            this.el = attribute.el || this._createElement();

            //called `initialize` function if that exist on attributes.
            if (util.isFunction(this.initialize)) {
                this.initialize.apply(this, arguments);
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
