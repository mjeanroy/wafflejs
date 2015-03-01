/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* global $ */
/* global _ */
/* global Grid */
/* global Waffle */

$.fn.waffle = function(options) {

  var PLUGIN_NAME = 'wafflejs';

  var functions = _.functions(Grid.prototype);
  var publicFunctions = _.filter(functions, function(fn) {
    return fn.charAt(0) !== '$';
  });

  _.forEach(publicFunctions, function(fn) {

    this[fn] = function() {
      var $waffle = $(this).data(PLUGIN_NAME);
      if ($waffle) {
        var result = $waffle[fn].apply($waffle, arguments);
        return result instanceof Grid ? this : result;
      }

      return this;
    };

  }, this);

  return this.each(function() {
    var $waffle = $(this).data(PLUGIN_NAME);
    if (!$waffle) {
      var opts = $.extend({}, $.fn.waffle.options);
      if (_.isObject(options)) {
        opts = $.extend(opts, options);
      }

      $waffle = new Grid(this, opts);
    }

    $(this).data(PLUGIN_NAME, $waffle);
  });

};

// Default options
$.fn.waffle.options = {
};

_.forEach(_.functions(Waffle), function(prop) {
  $.fn.waffle[prop] = Waffle[prop];
});
