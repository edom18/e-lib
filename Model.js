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
            this.id = (attribute.id) ? attribute.id : modelIdBase + (modelIdIndex++);

            if (this.defaults) {
                util.copyClone(attribute, this.defaults);
            }

            var params = {};
            for (var i in attribute) if (attribute.hasOwnProperty(i)) {
                if (typeof attribute[i] === 'function') {
                    continue;
                }
                params[i] = attribute[i];
            }

            //set data by defaults and argumetns.
            this.set(params, {silent: true});

            //copy to `_previousAttributes` current attributes.
            this._previousAttributes = util.copyClone({}, this.attributes);

            //called `initialize` function if that exist on attributes.
            if (util.isFunction(this.initialize)) {
                this.initialize.apply(this, arguments);
            }
        },

        /** @override */
        dispose: function () {
            this._super();
            this.attributes = null;
            this._previousAttributes = null;
        },

        /**
         * @return {Boolean} return true if model has been changed.
         */
        hasChanged: function () {
            return !util.isEmpty(this._changed);
        },

        /**
         * change attributes
         */
        change: function (options) {

            var key, ret;

            options || (options = {});

            if (this._changing || !this.hasChanged()) {
                return false;
            }

            this._changing = true;

            //fired `change` event that takes changed object.
            if (!options.silent) {
                this.trigger('change', {
                    changed: this._changed
                });

                //fired event of each paramaters.
                for (key in this._changed) {
                    ret = {};
                    ret[key] = this._changed[key];
                    this.trigger('change:' + key, {
                        changed: ret
                    });
                }
            }

            //copy `this.attributes` to `this._previousAttributes`.
            this._previousAttributes = util.copyClone({}, this.attributes);

            //delete changed object.
            this._changed = null;
            delete this._changed;

            this._changing = false;
        },
        set: function (name, val, options) {
        
            var attr, attrs,
                attributes = (this.attributes || (this.attributes = {}));

            this._changed || (this._changed = {});

            if (util.isString(name)) {
                attrs = {};
                attrs[name] = val;
            }
            else {
                attrs = name;
                options = val;
            }

            for (attr in attrs) {
                if (attributes[attr] === attrs[attr]) {
                    continue;
                }
                attributes[attr] = attrs[attr];
                this._changed[attr] = attrs[attr];
            }

            if (this.hasChanged()) {
                this.change(options);
            }
        },
        previous: function (attr) {
            if (!arguments.length || !this._previousAttributes) {
                return null;
            }
            return this._previousAttributes[attr];
        },
        previousAttributes: function () {
            return util.copyClone({}, this._previousAttributes);
        },
        get: function (name) {
            return this.attributes[name];
        },
        toJSON: function () {
            return util.copyClone({}, this.attributes);
        }
    });


    /*! ---------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */
    ns.Model = Model;

}(EventDispatcher, util, window));
