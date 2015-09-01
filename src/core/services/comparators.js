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

/* jshint eqnull:true */
/* global _ */
/* exported $comparators */
/* exported $$createComparisonFunction */

var $comparators = (function() {

  // Convert an object to a string.
  var toString = function(o) {
    return o == null ? '' : String(o.toString());
  };

  // Convert an object to a number.
  // NaN is automatically converted to zero.
  var toNumber = function(o) {
    return o == null ? 0 : (Number(o) || 0);
  };

  // Convert an object to a boolean integer.
  // A boolean integer is zero for a falsy value, one for a truthy value.
  // String "false" will be converted to a falsy boolean.
  var toBoolean = function(o) {
    return o === 'false' ? 0 : (Boolean(o) ? 1 : 0);
  };

  // Convert an object to a timestamp.
  var toDate = function(o) {
    var d = _.isDate(o) ? o : new Date(toNumber(o));
    return d.getTime();
  };

  // Create a comparison function by using substract operator.
  // First argument is a factory to transform arguments to a mathemical value.
  var toSubstraction = function(factory) {
    return function(a, b) {
      return factory(a) - factory(b);
    };
  };

  var instance = {
    // Compare two strings
    $string: function(a, b) {
      return toString(a).localeCompare(toString(b));
    },

    // Compare two numbers
    $number: toSubstraction(toNumber),

    // Compare two booleans
    $boolean: toSubstraction(toBoolean),

    // Compare two dates
    // Function accept timestamps as arguments
    $date: toSubstraction(toDate),

    // Perform an automatic comparison
    // Type of elements will be detected and appropriate comparison will be made
    $auto: function(a, b) {
      if (a === b || (a == null && b == null)) {
        return 0;
      }

      // Try to get most precise type
      // String must be always at last because it is the less precise type
      var value = _.find(['Number', 'Boolean', 'Date', 'String'], function(val) {
        var fn = _['is' + val];
        return fn(a) || fn(b);
      });

      if (value) {
        return instance['$' + value.toLowerCase()](a, b);
      }

      // Just do a simple comparison... (strict equality is already checked)
      return a < b ? -1 : 1;
    },

    // Get comparator by its name
    // Can be overridden by custom lookup
    $get: function(name) {
      return instance[name];
    }
  };

  return instance;
})();

// Create a comparison function using array of comparator
// Comparison function take two object in parameters and iterate
// over comparators to return zero, a negative value or a positive value
// Comparison stop when a comparator return a non-zero value (it means that
// first most precise comparison is used to compute the final result).
var $$createComparisonFunction = function(comparators) {
  if (!_.isArray(comparators)) {
    comparators = [comparators];
  }

  return function(o1, o2) {
    if (o1 === o2 || (o1 == null && o2 == null)) {
      return 0;
    }

    for (var i = 0, size = comparators.length; i < size; ++i) {
      var current = comparators[i];
      var a1 = current.parser(o1);
      var a2 = current.parser(o2);
      var result = current.fn.call($comparators, a1, a2);

      // Return first result that is not zero
      if (result) {
        return current.desc ? result * -1 : result;
      }
    }

    // Each comparator return zero, so compare function must return zero
    return 0;
  };
};
