(function (win, doc, exports) {

    'use strict';

    var sqrt = Math.sqrt;

    /**
     * Vector3 class
     * @constructor
     * @class
     * @param {number} x Position of x.
     * @param {number} y Position of y.
     * @param {number} z Position of z.
     */
    function Vector3(x, y, z) {
        this.set(x, y, z);
    }

    /**
     * Clear with zero.
     */
    Vector3.prototype.zero = function() {
        this.x = this.y = this.z = 0;
        return this;
    };

    /**
     * Check to equal values.
     * @param {Vector3} v
     */
    Vector3.prototype.equal = function(v) {
        return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
    };

    /**
     * Set values to x,y,z
     * @param {number|Array} x
     * @param {?number} y
     * @param {?number} z
     */
    Vector3.prototype.set = function(x, y, z) {

        var _x = 0,
            _y = 0,
            _z = 0;

        if (util.isArray(x)) {
            _x = x[0] || 0;
            _y = x[1] || 0;
            _z = x[2] || 0;
        }
        else {
            _x = x || 0;
            _y = y || 0;
            _z = z || 0;
        }

        this.x = _x;
        this.y = _y;
        this.z = _z;

        return this;
    };

    Vector3.prototype.sub = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    };

    Vector3.prototype.subVectors = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    };

    Vector3.prototype.add = function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    };

    Vector3.prototype.addVectors = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    };

    /**
     * Copy vector.
     * @param {Vector3} v
     */
    Vector3.prototype.copy = function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    };

    Vector3.prototype.norm = function() {
        return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };

    Vector3.prototype.normalize = function() {
        var nrm = this.norm();

        if (nrm !== 0) {
            nrm = 1 / nrm;
            this.x *= nrm;
            this.y *= nrm;
            this.z *= nrm;
        }

        return this;
    };

    Vector3.prototype.multiply = function(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    };

    Vector3.prototype.multiplyScalar = function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    };

    Vector3.prototype.multiplyVectors = function(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    };

    Vector3.prototype.dot = function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    Vector3.prototype.cross = function(v, w) {
        var x, y, z;
        if (w) {
            return this.crossVectors(v, w);
        }
        x = this.x;
        y = this.y;
        z = this.z;
        this.x = (y * v.z) - (z * v.y);
        this.y = (z * v.x) - (x * v.z);
        this.z = (x * v.y) - (y * v.x);
        return this;
    };

    Vector3.prototype.crossVectors = function(v, w) {
        this.x = (w.y * v.z) - (w.z * v.y);
        this.y = (w.z * v.x) - (w.x * v.z);
        this.z = (w.x * v.y) - (w.y * v.x);
        return this;
    };

    /**
     * Applay matrix for the vector.
     * @param {Float32Array} mat
     */
    Vector3.prototype.applyMatrix4 = function(mat) {

        var ret = new Vector3(),
            x = this.x,
            y = this.y,
            z = this.z;

        ret.x = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12];
        ret.y = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13];
        ret.z = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

        return ret;
    };

    /**
     * Applay matrix to the vector without `w` value.
     * @param {Float32Array} mat
     */
    Vector3.prototype.applyMatrix4withoutW = function (mat) {

        var clone = this.clone(),
            x = clone.x,
            y = clone.y,
            z = clone.z;

        clone.x = mat[0] * x + mat[4] * y + mat[8]  * z;
        clone.y = mat[1] * x + mat[5] * y + mat[9]  * z;
        clone.z = mat[2] * x + mat[6] * y + mat[10] * z;

        return clone;
    };

    /**
     * 射影投影座標変換

     * 計算された座標変換行列をスクリーンの座標系に変換するために計算する
     * 基本はスケーリング（&Y軸反転）と平行移動。
     * 行列で表すと
     * w = width  / 2
     * h = height / 2
     * とすると
     * |w  0  0  0|
     * M(screen) = |0 -h  0  0|
     * |0  0  1  0|
     * |w  h  0  1|

     * 4x4の変換行列を対象の1x4行列[x, y, z, 1]に適用する
     * 1x4行列と4x4行列の掛け算を行う

     * |@_11 @_12 @_13 @_14|   |x|
     * |@_21 @_22 @_23 @_24| x |y|
     * |@_31 @_32 @_33 @_34|   |z|
     * |@_41 @_42 @_43 @_44|   |1|

     * @_4nは1x4行列の最後が1のため、ただ足すだけになる

     * @param {Array.<number>} out
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    Vector3.prototype.applyProjection = function(m, out) {
        var e, w, x, y, z, _w, _x, _y, _z;
        x = this.x;
        y = this.y;
        z = this.z;
        e = m.elements;
        w = e[3] * x + e[7] * y + e[11] * z + e[15];
        _w = 1 / w;
        _x = e[0] * x + e[4] * y + e[8] * z + e[12];
        _y = e[1] * x + e[5] * y + e[9] * z + e[13];
        _z = e[2] * x + e[6] * y + e[10] * z + e[14];

        if (!(((-w <= _x && _x <= w)) || ((-w <= _y && _y <= w)) || ((-w <= _z && _z <= w)))) {
            return false;
        }

        this.x = _x * _w;
        this.y = _y * _w;
        this.z = _z * _w;
        
        out[0] = this;
        out[1] = w;

        return this;
    };

    /**
     * Return a clone vector.
     * @return {Vector3}
     */
    Vector3.prototype.clone = function() {
        return new Vector3(this.toArray());
    };

    /**
     * Convert to an array with xyz values.
     * @return {Array}
     */
    Vector3.prototype.toArray = function() {
        return [this.x, this.y, this.z];
    };

    /**
     * To string vector.
     * @return {string}
     */
    Vector3.prototype.toString = function() {
        return "" + this.x + "," + this.y + "," + this.z;
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.Vector3 = Vector3;

}(window, document, window));
