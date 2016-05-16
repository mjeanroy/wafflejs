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

/* jshint eqnull: true */
/* global _ */
/* global $parse */
/* exported $filters */

const $filters = (() => {
  const toString = val => val == null ? '' : val.toString();

  const $match = (value, predicate, matcher) => {
    const str1 = toString(value);
    const str2 = toString(predicate);
    return matcher(str1, str2);
  };

  // Case-insensitive matching
  const $ciMatching = (o1, o2) => o1.toLowerCase().indexOf(o2.toLowerCase()) >= 0;

  const $contains = (value, predicate) => $match(value, predicate, $ciMatching);

  const createPredicateFromValue = predicateValue => {
    const newPredicate = value => {
      return _.some(_.keys(value), prop => {
        const propValue = value[prop];
        return _.isObject(propValue) ?
          newPredicate(propValue) :
          $contains(value[prop], predicateValue);
      });
    };

    return newPredicate;
  };

  const createPredicateFromObject = predicateObject => {
    const predicates = _.map(_.keys(predicateObject), prop => {
      return value => $contains($parse(prop)(value), predicateObject[prop]);
    });

    return value => _.every(predicates, predicate => predicate(value));
  };

  // Create filter function from a custom predicate
  return {
    $create: predicate => {
      if (_.isFunction(predicate)) {
        // If it is already a function, return it.
        return predicate;
      }

      // Get appropriate factory
      const predicateFactory = _.isObject(predicate) ?
        createPredicateFromObject :
        createPredicateFromValue;

      // Create predicate function using factory
      const predicateFn = predicateFactory(predicate);

      // Store original predicate value
      predicateFn.$predicate = predicate;

      return predicateFn;
    }
  };
})();
