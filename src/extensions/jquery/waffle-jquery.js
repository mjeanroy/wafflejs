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

// Plugin name used to register grid with $.fn.data method
const $PLUGIN_NAME = 'wafflejs';

$.fn.waffle = function(options) {

  let retValue = this;
  const args = [retValue].concat(_.rest(arguments));

  // Initialize plugin
  if (_.isUndefined(options) || _.isObject(options)) {
    this.each(function() {
      const $this = $(this);

      let $waffle = $this.data($PLUGIN_NAME);
      if (!$waffle) {
        $waffle = Waffle.create(this, options);
        $this.data($PLUGIN_NAME, $waffle);

        // Destroy grid when node is removed
        $this.on('waffleDestroyed', function() {
          const $table = $(this);
          $table.data($PLUGIN_NAME).destroy();
          $table.removeData($PLUGIN_NAME).off();
        });
      }
    });
  } else if (_.isString(options)) {
    // Call method
    retValue = $.fn.waffle[options].apply(null, args) || retValue;
  }

  // Chain or return effective result
  return retValue;
};

// Default options
$.fn.waffle.options = {
};

// Add special event to destroy grid when node is removed
$.event.special.waffleDestroyed = {
  add: function(o) {
    if (o.handler) {
      o.handler = _.bind(o.handler, this);
    }
  },
  remove: function(o) {
    if (o.handler) {
      o.handler(o);
    }
  }
};

// Map public functions of grid

const $publicFunctions = _.filter(_.functions(Grid.prototype), fn => fn.charAt(0) !== '$');

_.forEach($publicFunctions, function(fn) {
  $.fn.waffle[fn] = function($selection) {
    const args = _.rest(arguments);
    let retValue = [];

    $selection.each(function() {
      const $table = $(this);
      const $grid = $table.data($PLUGIN_NAME);
      if ($grid) {
        const result = $grid[fn].apply($grid, args);
        const chainResult = result instanceof Grid ? $selection : result;

        if (chainResult === $selection) {
          retValue[0] = chainResult;
        } else {
          retValue.push(chainResult);
        }
      }
    });

    return retValue.length === 1 ? retValue[0] : retValue;
  };
});

// Map static waffle methods
_.forEach(_.functions(Waffle), prop => $.fn.waffle[prop] = Waffle[prop]);

// Map options with $.fn.waffle.options
$.fn.waffle.options = Grid.options;
