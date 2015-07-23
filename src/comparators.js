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

var $comparators = {
  // Compare two strings
  $string: function(a, b) {
    var str1 = a == null ? '' : String(a);
    var str2 = b == null ? '' : String(b);
    return str1.localeCompare(str2);
  },

  // Compare two numbers
  $number: function(a, b) {
    var n1 = a == null ? 0 : Number(a);
    var n2 = b == null ? 0 : Number(b);
    return n1 - n2;
  },

  // Compare two booleans
  $boolean: function(a, b) {
    var b1 = a === 'false' ? 0 : (Boolean(a) ? 1 : 0);
    var b2 = b === 'false' ? 0 : (Boolean(b) ? 1 : 0);
    return b1 - b2;
  },

  // Compare two dates
  // Function accept timestamps as arguments
  $date: function(a, b) {
    var t1 = _.isDate(a) ? a.getTime() : new Date(a == null ? 0 : a).getTime();
    var t2 = _.isDate(b) ? b.getTime() : new Date(b == null ? 0 : b).getTime();
    return t1 - t2;
  },

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
      return $comparators['$' + value.toLowerCase()](a, b);
    }

    // Just do a simple comparison... (strict equality is already checked)
    return a < b ? -1 : 1;
  },

  // Get comparator by its name
  // Can be overridden by custom lookup
  $get: function(name) {
    return $comparators[name];
  }
};

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
