/*
 * Easing functions.
 *
 * Copyright (c) 2013 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.0.1
 */
(function (win, doc, ns, undefined) {

    'use strict';

    //import math functions.
    var sin = Math.sin,
        cos = Math.cos,
        pow = Math.pow,
        sqrt = Math.sqrt;

    var easing = {

        easing1: function (a, b, x) {
            x = 1.0 - x;
            var f = 1.0 - (x * x * x * x);
            return a * (1.0 - f) + b * f; 
        },

        linear: function (a, b, x) {
            return a * (1.0 - x) + b * x;
        },

        easeInOutExpo: function (a, b, x) {
            var c = b - a;
            var t = x * 2;

            if (t < 1) {
                return c / 2 * pow(2, 10 * (t - 1)) + a;
            }

            return c / 2 * (-pow(2, -10 * (t - 1)) + 2) + a;
        },

        easeInExpo: function (a, b, x) {
            var c = b - a;
            return c * pow(2, 10 * (x - 1)) + a;
        },

        easeOutExpo: function (a, b, x) {
            var c = b - a;
            return c * (-pow(2, -10 * x) + 1) + a;
        }
    };

    //export to global.
    ns.easing = easing;

}(window, document, window));
