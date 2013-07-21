(function (win, doc, exports) {

    'use strict';

    var sin = Math.sin,
        cos = Math.cos;

    /**
     * Make rotation quaternion
     * @param {number} t.
     * @param {Vector3} v.
     */
    function Quaternion(t, v) {
        this.set(t, v);
    }

    Quaternion.prototype = {
        constructor: Quaternion,
        set: function (t, v) {
            this.t = t;
            this.v = v;
        },

        multiply: function (A) {
            return Quaternion.multiply(this, A);
        }
    };

    /**
     * Multiply quaternions.
     *
     * @example
     *      Quaternionの掛け算の公式は以下。
     *      ※ただし、計算しやすいよう本来はVxUとなるところを、UxVとしている点に注意。
     *      ・は内積、×は外積、U, Vはともにベクトル。
     *      ;の左が実部、右が虚部。基本的に実部は`0`で計算。
     *      A = (a; U) 
     *      B = (b; V) 
     *      AB = (ab - U・V; aV + bU + U×V)
     */
    Quaternion.multiply = function (A, B) {

        var Av, Bv,
            d1, d2, d3, d4, t,
            x, y, z;

        Av = A.v;
        Bv = B.v;

        // 実部の計算
        d1 =  A.t * B.t;
        d2 = -Av.x * Bv.x;
        d3 = -Av.y * Bv.y;
        d4 = -Av.z * Bv.z;
        t = parseFloat((d1 + d2 + d3 + d4).toFixed(5));

        // 虚部xの計算
        d1 = (A.t * Bv.x) + (B.t * Av.x);   //aV + bU
        d2 = (Av.y * Bv.z) - (Av.z * Bv.y); //U x V
        x = parseFloat((d1 + d2).toFixed(5));

        // 虚部yの計算
        d1 = (A.t * Bv.y) + (B.t * Av.y);   //aV + bU
        d2 = (Av.z * Bv.x) - (Av.x * Bv.z); //U x V
        y = parseFloat((d1 + d2).toFixed(5));

        // 虚部zの計算
        d1 = (A.t * Bv.z) + (B.t * Av.z);   //aV + bU
        d2 = (Av.x * Bv.y) - (Av.y * Bv.x); //U x V
        z = parseFloat((d1 + d2).toFixed(5));

        return new Quaternion(t, new Vector3(x, y, z));
    };

    /**
     * Make a quaternion.
     * @param {number} radian
     * @param {Vector3} vector
     * @return {Quaternion}
     * @example
     *
     *      var p = new Quaternion(0, vector);
     *
     *      var rad = sp * DEG_TO_RAD;
     *
     *      // rad角の回転クォータニオンとその共役を生成
     *      var q = makeRotatialQuaternion(rad, vec)
     *      var r = makeRotatialQuaternion(-rad, vec)
     *
     *      // Quaternionを以下のように計算
     *      // RPQ (RはQの共役）
     *      
     *      p = r.multiply(p);
     *      p = p.multiply(q);
     *
     *      this.v = p.v;
     */
    Quaternion.makeRotatialQuaternion = function (radian, vector) {

        var ret = new Quaternion(),
            ccc = 0,
            sss = 0,
            axis = new Vector3(vector.toArray()),
            norm = vector.norm();

        if (norm <= 0.0) {
            return ret;
        }

        axis.normalize();

        /*!
         * Quaternionの中の数値は以下。
         * q = [ cos(θ/2) sin(θ/2)n ] //nはベクトル
         *   = [ cos(θ/2) (sin(θ/2)nx sin(θ/2)ny sin(θ/2)nz ] //ベクトル成分を分解して表記
         */
        ccc = cos(0.5 * radian);
        sss = sin(0.5 * radian);

        var t = ccc;
        axis.multiplyScalar(sss);

        ret.set(t, axis);

        return ret;
    };

    /*!--------------------------------------------------
      EXPORTS
    ----------------------------------------------------- */
    exports.Quaternion = Quaternion;

}(window, document, window));
