(function (win, doc, exports) {

    'use strict';

    var sqrt = Math.sqrt;

    /**
     * Vector4 class
     * @constructor
     * @class
     * @param {number} x Component of x.
     * @param {number} y Component of y.
     * @param {number} z Component of z.
     * @param {number} w Component of w.
     */
    function Vector4(x, y, z, w) {
        this.set(x, y, z, w);
    }

    /**
     * Check to equal values.
     * @param {Vector4} v
     */
    Vector4.prototype.equal = function(v) {
        return (this.x === v.x) && (this.y === v.y) && (this.z === v.z) && (this.w === v.w);
    };

    /**
     * Set values to x,y,z
     * @param {number|Array} x
     * @param {?number} y
     * @param {?number} z
     */
    Vector4.prototype.set = function(x, y, z, w) {

        var _x = 0,
            _y = 0,
            _z = 0,
            _w = 0;

        if (util.isArray(x)) {
            _x = x[0] || 0;
            _y = x[1] || 0;
            _z = x[2] || 0;
            _w = (x[3] !== undefined) ? x[3] : 1;
        }
        else {
            _x = x || 0;
            _y = y || 0;
            _z = z || 0;
            _w = (w !== undefined) ? w : 1;
        }

        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.w = _w;

        return this;
    };

    Vector4.prototype.sub = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    };

    Vector4.prototype.subVectors = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
    };

    Vector4.prototype.add = function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    };

    Vector4.prototype.addVectors = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
    };

    /**
     * Copy vector.
     * @param {Vector4} v
     */
    Vector4.prototype.copy = function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = (v.w !== undefined) ? v.w : 1;
        return this;
    };

    Vector4.prototype.norm = function() {
        return sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    };

    Vector4.prototype.normalize = function() {
        var nrm = this.norm();

        if (nrm !== 0) {
            nrm = 1 / nrm;
            this.x *= nrm;
            this.y *= nrm;
            this.z *= nrm;
            this.w *= nrm;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        }

        return this;
    };

    Vector4.prototype.multiplyScalar = function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    };

    Vector4.prototype.dot = function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    };

    /**
     * Applay matrix for the vector.
     * @param {Float32Array} mat
     */
    Vector4.prototype.applyMatrix4 = function(mat) {

        var ret = new Vector4(),
            x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;

        ret.x = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12] * w;
        ret.y = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13] * w;
        ret.z = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
        ret.w = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;

        return ret;
    };

    /**
     * Return a clone vector.
     * @return {Vector4}
     */
    Vector4.prototype.clone = function() {
        return new Vector4(this.toArray());
    };

    /**
     * Convert to an array with xyz values.
     * @return {Array}
     */
    Vector4.prototype.toArray = function() {
        return [this.x, this.y, this.z, this.w];
    };

    /**
     * To string vector.
     * @return {string}
     */
    Vector4.prototype.toString = function() {
        return '' + this.x + ',' + this.y + ',' + this.z + ',' + this.w;
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.Vector4 = Vector4;

}(window, document, window));
