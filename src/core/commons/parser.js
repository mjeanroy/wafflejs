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
/* global Stack */
/* exported $parse */

/**
 * Parser used to handle reflection operations:
 * - Getter function.
 * - Setter function.
 *
 * Complex and nested object are supported:
 *     $parse('id')({ id: 1 }) === 1
 *     $parse('nested.id')({ nested: { id: 1 } }) === 1
 */

var $parse = (function() {
  var cache = new HashMap();

  var throwError = function(end) {
    throw Error('Malformed expression: ' + end || 'unexpected end of input');
  };

  var defaultHandler = function(currentChar, current) {
    return current + currentChar;
  };

  var checkEnd = function(openChar) {
    return function(currentChar, current, results, stack) {
      if (stack.pop() !== openChar) {
        throwError();
      }
    };
  };

  var EMPTY_STR = '';
  var DOT = '.';
  var OPEN_BRACKET = '[';
  var OPEN_PARENTHESIS = '(';
  var CLOSE_BRACKET = ']';
  var CLOSE_PARENTHESIS = ')';
  var DOUBLE_QUOTE = '"';
  var SINGLE_QUOTE = '\'';
  var SPACE = ' ';

  var handlers = {};

  // Process dot character.
  // This should indicate a key delimiter.
  handlers[DOT] = function(currentChar, current, results) {
    results.push(current);
    return EMPTY_STR;
  };

  // Process bracket character.
  // This should indicate a key delimiter.
  // Note that open bracket must be closed at the end.
  handlers[OPEN_BRACKET] = function(currentChar, current, results, stack) {
    stack.push(currentChar);
    return handlers[DOT].apply(this, arguments);
  };

  // Process open parenthesis.
  // This should indicate a function call.
  // Note that open parenthesis must be closed at the end.
  handlers[OPEN_PARENTHESIS] = function(currentChar, current, results, stack) {
    stack.push(currentChar);
  };

  // Process double quote.
  // Note that double quote must be closed at the end.
  handlers[DOUBLE_QUOTE] = function(currentChar, current, results, stack) {
    switch (stack.peek()) {
      case currentChar:
        // First case is simple: quote is closed
        stack.pop();
        break;
      case OPEN_BRACKET:
        // Second case is also simple: quote is preceeded by a bracket
        stack.push(currentChar);
        break;
      default:
        // Otherwise, this is a malformed expression
        throwError();
    }
  };

  // Process space.
  // Space is ignored between open and close parenthesis.
  // Space is ignored between open and close bracket (if not inside a key).
  handlers[SPACE] = function(currentChar, current, results, stack) {
    var previous = stack.peek();
    if (previous !== OPEN_PARENTHESIS && previous !== OPEN_BRACKET) {
      return current + currentChar;
    }
  };

  // Process single quote.
  // Behavior should be the same as double quote.
  handlers[SINGLE_QUOTE] = handlers[DOUBLE_QUOTE];

  // Process close tags.
  // This should only check that associated open tag is the last value in
  // stack.
  handlers[CLOSE_BRACKET] = checkEnd(OPEN_BRACKET);
  handlers[CLOSE_PARENTHESIS] = checkEnd(OPEN_PARENTHESIS);

  // This is a really simple parser that will turn attribute
  // path to a normalized path.
  // --
  // Examples:
  //  foo.bar           => foo.bar
  //  foo[0]            => foo.0
  //  foo['id']         => foo.id
  //  foo["id"]         => foo.id
  //  foo.bar[0]['id']  => foo.bar.0.id
  // --
  // Running time: 0(n)
  var $normalize = function(key) {
    var results = [];
    var stack = new Stack();
    var current = '';

    for (var i = 0, size = key.length; i < size; ++i) {
      var currentChar = key.charAt(i);
      var handler = handlers[currentChar] || defaultHandler;

      // Process handler and check result.
      var handlerResult = handler(currentChar, current, results, stack);

      // If returned value is a string, then current part must be updated
      // with the returned value.
      if (_.isString(handlerResult)) {
        current = handlerResult;
      }
    }

    // Stack must be empty at the end, otherwise, expression is not ended.
    // Last part must also not be empty.
    if (!stack.isEmpty() || !current) {
      throwError();
    }

    // Do not forget to push last part
    results.push(current);

    return results;
  };

  var ensureObject = function(object) {
    if (object == null) {
      return {};
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

  return function(key) {
    if (!cache.contains(key)) {
      var parts = $normalize(key);

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
})();
