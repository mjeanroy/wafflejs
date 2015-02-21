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

var $parse = function(key) {
  var parts = $parse.$split(key);
  var size = parts.length;

  return function(object) {
    var current = object;

    for (var i = 0; i < size; ++i) {
      if (current == null || !_.isObject(current)) {
        return undefined;
      }

      current = current[parts[i]];
    }

    return current;
  };
};

// Transform bracket notation to dot notation
// This is a really simple parser that will turn attribute
// path to a normalized path
// Examples:
//  foo.bar           => foo.bar
//  foo[0]            => foo.0
//  foo['id']         => foo.id
//  foo["id"]         => foo.id
//  foo.bar[0]['id']  => foo.bar.0.id
$parse.$normalize = function(key) {
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
    results[i] = parts[i].replace(arrayIndex, replacer)
                         .replace(bracketSingleQuote, replacer)
                         .replace(bracketDoubleQuote, replacer);
  }

  return results.join('.');
};

// Split key value to an array containing each part of attribute.
// It should allow anyone to traverse deep objects
$parse.$split = function(key) {
  return $parse.$normalize(key).split('.');
};
