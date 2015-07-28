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

var $filters = (function() {
  var instance = {};

  var toString = function(val) {
    return val == null ? '' : val.toString();
  };

  var createPredicateFromValue = function(predicateValue) {
    var newPredicate = function(value) {
      return _.some(_.keys(value), function(prop) {
        var propValue = value[prop];
        return _.isObject(propValue) ?
          newPredicate(propValue) :
          instance.$contains(value[prop], predicateValue);
      });
    };

    return newPredicate;
  };

  var createPredicateFromObject = function(predicateObject) {
    var predicates = _.map(_.keys(predicateObject), function(prop) {
      return function(value) {
        return instance.$contains($parse(prop)(value), predicateObject[prop]);
      };
    });

    return function(value) {
      return _.every(predicates, function(predicate) {
        return predicate(value);
      });
    };
  };

  // Check that value and predicate match according
  // to given matcher function.
  instance.$match = function(value, predicate, matcher) {
    var str1 = toString(value);
    var str2 = toString(predicate);
    return matcher(str1, str2);
  };

  // Check that predicate is included in given value.
  instance.$contains = function(value, predicate) {
    return instance.$match(value, predicate, function(o1, o2) {
      // Use a case-insensitive matching
      return o1.toLowerCase().indexOf(o2.toLowerCase()) >= 0;
    });
  };

  // Create filter function from a custom predicate
  instance.$create = function(predicate) {
    if (_.isFunction(predicate)) {
      return predicate;
    }

    // Get appropriate factory
    var predicateFactory = _.isObject(predicate) ? createPredicateFromObject : createPredicateFromValue;

    // Create predicate function using factory
    var predicateFn = predicateFactory(predicate);

    // Store original predicate value
    predicateFn.$predicate = predicate;

    return predicateFn;
  };

  return instance;
})();
