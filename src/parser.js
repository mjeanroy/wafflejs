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
/* global HashMap */
/* exported $parse */

var $parse = (function() {
  var cache = new HashMap();

  // Transform bracket notation to dot notation
  // This is a really simple parser that will turn attribute
  // path to a normalized path
  // Examples:
  //  foo.bar           => foo.bar
  //  foo[0]            => foo.0
  //  foo['id']         => foo.id
  //  foo["id"]         => foo.id
  //  foo.bar[0]['id']  => foo.bar.0.id
  var $normalize = function(key) {
    var results = [];
    var parts = key.split('.');

    var arrayIndex = /(.+?)?(\[(\d+)\])/;
    var bracketSingleQuote = /(.+?)?(\['(.+)'\])/;
    var bracketDoubleQuote = /(.+?)?(\["(.+)"\])/;

    var replacer = function(match, p1, p2, p3) {
      var prefix = p1 ? p1 + '.' : '';
      return prefix + p3;
    };

    for (var i = 0, size = parts.length; i < size; ++i) {
      var part = parts[i].replace(arrayIndex, replacer)
                         .replace(bracketSingleQuote, replacer)
                         .replace(bracketDoubleQuote, replacer);

      // Remove parenthesis if name is a function call
      var openParenthesis = part.indexOf('(');
      if (openParenthesis > 0) {
        part = part.slice(0, openParenthesis);
      }

      results[i] = part;
    }

    return results.join('.');
  };

  // Split key value to an array containing each part of attribute.
  // It should allow anyone to traverse deep objects
  var $split = function(key) {
    return $normalize(key).split('.');
  };

  var ensureObject = function(object) {
    if (object == null) {
      return {};
    }

    if (!_.isObject(object)) {
      throw new Error('Cannot assign to ready property "' + object + '"');
    }

    return object;
  };

  var getter = function(parts, object) {
    var size = parts.length;
    var current = object;

    for (var i = 0; i < size; ++i) {
      if (current == null || !_.isObject(current)) {
        return undefined;
      }

      current = _.result(current, parts[i]);
    }

    return current;
  };

  var setter = function(parts, object, value) {
    var size = parts.length - 1;
    var current = object;
    var result = current;

    for (var i = 0; i < size; ++i) {
      result = _.result(current, parts[i]);
      result = current[parts[i]] = ensureObject(result);
    }

    result[_.last(parts)] = value;
    return value;
  };

  var o = function(key) {
    if (!cache.contains(key)) {
      var parts = $split(key);

      var $getter = function(object) {
        return getter(parts, object);
      };

      $getter.assign = function(object, value) {
        return setter(parts, object, value);
      };

      cache.put(key, $getter);
    }

    return cache.get(key);
  };

  o.$clear = function() {
    cache.clear();
    return o;
  };

  o.assign = function() {

  };

  return o;
})();