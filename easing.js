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
        sqrt = Math.sqrt,
        PI  = Math.PI,
        hPI = PI / 2;

    var easing = {

        leap: function (a, b, x) {
            x = 1.0 - x;
            var f = 1.0 - (x * x * x * x);
            return a * (1.0 - f) + b * f; 
        },

        linear: function (a, b, x) {
            return a * (1.0 - x) + b * x;
        },

        easeInCubic: function (a, b, x) {
            var c = b - a;
            return c * pow(x, 3) + a;
        },
        easeOutCubic: function (a, b, x) {
            var c = b - a;
            return c * (pow(x - 1, 3) + 1) + a;
        },
        easeInOutCubic: function (a, b, x) {
            var c = b - a;
            var t = x * 2;

            if (t < 1) {
                return c / 2 * pow(t, 3) + a;
            }
            return c / 2 * (pow(t - 2, 3) + 2) + a;
        },

        easeInSine: function (a, b, x) {
            var c = b - a;
            return c * (1 - cos(x * (hPI))) + a;
        },

        easeOutSine: function (a, b, x) {
            var c = b - a;
            return c * sin(x * (hPI)) + a;
        },

        easeInOutSine: function (a, b, x) {
            var c = b - a;
            return c / 2 * (1 - cos(PI * x)) + a;
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
        },

        // easeInBack: function (t, b, c, d, s) {
        easeInBack: function (a, b, x, s) {
            if (s === undefined) {
                s = 1.70158;
            }

            var c = b - a;
            return c * x * x * ((s + 1) * x - s) + a;
        },

        easeOutBack: function (a, b, x, s) {
            if (s === undefined) {
                s = 1.70158;
            }

            var c = b - a;
            var t = x - 1;
            return c * (t * t * ((s + 1) * t + s) + 1) + a;
        },

        easeInOutBack: function (a, b, x, s) {
            if (s === undefined) {
                s = 1.70158; 
            }

            var c = b - a;
            var t = x * 2;

            if (t < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + a;
            }

            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + a;
        }
    };

    //export to global.
    ns.easing = easing;

}(window, document, window));
