/**
 * Gives a model function.
 */
(function (EventDispatcher, util, ns) {

    var modelIdBase     = 'id',
        modelIdIndex    = 0;

    var Model = EventDispatcher.extend({
        init: function (args, opt) {

            var attribute = args || {};

            //setting this model's id.
            this.id = (attribute.id) ? attribute.id : modelIdBase + (++modelIdIndex);

            if (this.defaults) {
                copyClone(attribute, this.defaults);
            }

            //set data by defaults and argumetns.
            this.set(attribute, {silent: true});

            //copy to `_previousAttributes` current attributes.
            this._previousAttributes = copyClone({}, this.attributes);

            //called `initialize` function if that exist on attributes.
            if (util.isFunction(this.initialize)) {
                this.initialize.apply(this, arguments);
            }
        }
    });


    /*! ---------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */
    ns.Model = Model;

}(EventDispatcher, util, window));
