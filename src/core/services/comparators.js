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

const $comparators = (() => {

  // Convert an object to a string.
  const toString = o => o == null ? '' : String(o.toString());

  // Convert an object to a number.
  // NaN is automatically converted to zero.
  const toNumber = o => o == null ? 0 : (Number(o) || 0);

  // Convert an object to a boolean integer.
  // A boolean integer is zero for a falsy value, one for a truthy value.
  // String "false" will be converted to a falsy boolean.
  const toBoolean = o => o === 'false' ? 0 : (Boolean(o) ? 1 : 0);

  // Convert an object to a timestamp.
  const toDate = o => {
    const d = _.isDate(o) ? o : new Date(toNumber(o));
    return d.getTime();
  };

  // Create a comparison function by using substract operator.
  // First argument is a factory to transform arguments to a mathemical value.
  const toSubstraction = factory => {
    return (a, b) => {
      return factory(a) - factory(b);
    };
  };

  const instance = {
    // Compare two strings
    $string: (a, b) => toString(a).localeCompare(toString(b)),

    // Compare two numbers
    $number: toSubstraction(toNumber),

    // Compare two booleans
    $boolean: toSubstraction(toBoolean),

    // Compare two dates
    // Function accept timestamps as arguments
    $date: toSubstraction(toDate),

    // Perform an automatic comparison
    // Type of elements will be detected and appropriate comparison will be made
    $auto: (a, b) => {
      if (a === b || (a == null && b == null)) {
        return 0;
      }

      // Try to get most precise type
      // String must be always at last because it is the less precise type
      const value = _.find(['Number', 'Boolean', 'Date', 'String'], val => {
        const fn = _['is' + val];
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
    $get: name => instance[name]
  };

  return instance;
})();
