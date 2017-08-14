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

import {has, isNil, isNumber, isString, isDate, isBoolean, find, toString} from '@waffle/commons';

/**
 * Translate boolean value (or string representation of a boolean) to
 * the equivalent number value (1 for `true`, 0 for `false`).
 *
 * @param {*} x The value to translate to a boolean integer.
 * @return {number} The boolean int value.
 */
function fromBoolean(x) {
  return x === 'false' ? 0 : (Boolean(x) ? 1 : 0);
}

/**
 * Translate number value (or string representation of a number) to
 * the equivalent number value (for example, `null` will be translated to zero).
 *
 * @param {*} x The value to translate to a number.
 * @return {number} The number value.
 */
function fromNumber(x) {
  return isNil(x) ? 0 : (Number(x) || 0);
}

/**
 * Translate date value (or string representation of a date) to
 * the equivalent number (i.e timestamp) value.
 *
 * @param {*} x The value to translate to a number.
 * @return {number} The number value.
 */
function fromDate(x) {
  return (isDate(x) ? x : new Date(fromNumber(x))).getTime();
}

/**
 * Compare two number values.
 *
 * @param {number} x First number to compare.
 * @param {number} y Second number to compare.
 * @return {number} A number less than zero if x < y, greater than zero if x > y, zero otherwise.
 */
function compareNumbers(x, y) {
  return x === y ? 0 : (x < y ? -1 : 1);
}

// The list of type that can be easily detected in the `auto` comparison.
const compFn = [
  {type: 'number', fn: isNumber},
  {type: 'boolean', fn: isBoolean},
  {type: 'date', fn: isDate},
  {type: 'string', fn: isString},
];

const comparators = {
  /**
   * Compare two strings (will be converted to strings if parameters
   * are not already valid string).
   *
   * @param {*} x First value to compare as a string.
   * @param {*} y Second value to compare as a string.
   * @return {number} A number less than zero if x < y, greater than zero if x > y, zero otherwise.
   */
  $string(x, y) {
    return toString(x).localeCompare(toString(y));
  },

  /**
   * Compare two numbers (will be converted to numbers if parameters
   * are not already valid numbers).
   *
   * @param {*} x First value to compare as a number.
   * @param {*} y Second value to compare as a number.
   * @return {number} A number less than zero if x < y, greater than zero if x > y, zero otherwise.
   */
  $number(x, y) {
    return compareNumbers(fromNumber(x), fromNumber(y));
  },

  /**
   * Compare two booleans (will be converted to numbers if parameters
   * are not already valid booleans).
   *
   * @param {*} x First value to compare as a number.
   * @param {*} y Second value to compare as a number.
   * @return {number} A number less than zero if x < y, greater than zero if x > y, zero otherwise.
   */
  $boolean(x, y) {
    return compareNumbers(fromBoolean(x), fromBoolean(y));
  },

  /**
   * Compare two dates (will be converted to numbers if parameters
   * are not already valid dates).
   *
   * @param {*} x First value to compare as a number.
   * @param {*} y Second value to compare as a number.
   * @return {number} A number less than zero if x < y, greater than zero if x > y, zero otherwise.
   */
  $date(x, y) {
    return compareNumbers(fromDate(x), fromDate(y));
  },

  /**
   * Compare two values: this function will try to detect type of values automatically
   * and use a default comparison if it cannot be detected.
   *
   * @param {*} x First value to compare as a number.
   * @param {*} y Second value to compare as a number.
   * @return {number} A number less than zero if x < y, greater than zero if x > y, zero otherwise.
   */
  $auto(x, y) {
    if (x === y || (isNil(x) && isNil(y))) {
      return 0;
    }

    // Try to get most precise type
    // String must be always at last because it is the less precise type
    const comparator = find(compFn, (c) => {
      return c.fn(x) || c.fn(y);
    });

    if (comparator) {
      return comparators[`$${comparator.type}`](x, y);
    }

    // Just do a simple comparison... (strict equality is already checked)
    return x < y ? -1 : 1;
  },
};

/**
 * Get existing comparator from its name, or returns `null` if it does not exist.
 *
 * @param {string} name Comparator name.
 * @return {function} The comparison function.
 */
export function getComparator(name) {
  return has(comparators, name) ? comparators[name] : null;
}
