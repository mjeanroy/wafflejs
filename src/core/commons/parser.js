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

const $parse = (() => {
  const cache = new HashMap();

  const throwError = end => {
    throw Error('Malformed expression: ' + end || 'unexpected end of input');
  };

  const defaultHandler = (currentChar, current) => current + currentChar;

  const checkEnd = openChar => {
    return (currentChar, current, results, stack) => {
      if (stack.pop() !== openChar) {
        throwError();
      }
    };
  };

  const EMPTY_STR = '';
  const DOT = '.';
  const OPEN_BRACKET = '[';
  const OPEN_PARENTHESIS = '(';
  const CLOSE_BRACKET = ']';
  const CLOSE_PARENTHESIS = ')';
  const DOUBLE_QUOTE = '"';
  const SINGLE_QUOTE = '\'';
  const SPACE = ' ';

  const handlers = {
    // Process dot character.
    // This should indicate a key delimiter.
    [DOT]: (currentChar, current, results) => {
      results.push(current);
      return EMPTY_STR;
    },

    // Process open parenthesis.
    // This should indicate a function call.
    // Note that open parenthesis must be closed at the end.
    [OPEN_PARENTHESIS]: (currentChar, current, results, stack) => {
      stack.push(currentChar);
    },

    // Process double quote.
    // Note that double quote must be closed at the end.
    [DOUBLE_QUOTE]: (currentChar, current, results, stack) => {
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
    },

    // Process space.
    // Space is ignored between open and close parenthesis.
    // Space is ignored between open and close bracket (if not inside a key).
    [SPACE]: (currentChar, current, results, stack) => {
      const previous = stack.peek();
      if (previous !== OPEN_PARENTHESIS && previous !== OPEN_BRACKET) {
        return current + currentChar;
      }
    },

    // Process bracket character.
    // This should indicate a key delimiter.
    // Note that open bracket must be closed at the end.
    [OPEN_BRACKET]: (currentChar, current, results, stack) => {
      stack.push(currentChar);
      return handlers[DOT](currentChar, current, results, stack);
    },

    // Process close tags.
    // This should only check that associated open tag is the last value in
    // stack.
    [CLOSE_BRACKET]: checkEnd(OPEN_BRACKET),
    [CLOSE_PARENTHESIS]: checkEnd(OPEN_PARENTHESIS)
  };

  // Process single quote.
  // Behavior should be the same as double quote: just make this function
  // point to the double quote function.
  handlers[SINGLE_QUOTE] = handlers[DOUBLE_QUOTE];

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
  const $normalize = key => {
    const results = [];
    const stack = new Stack();
    let current = '';

    for (let i = 0, size = key.length; i < size; ++i) {
      const currentChar = key.charAt(i);
      const handler = handlers[currentChar] || defaultHandler;

      // Process handler and check result.
      const handlerResult = handler(currentChar, current, results, stack);

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

  const ensureObject = object => object == null ? {} : object;

  const getter = (parts, object) => {
    const size = parts.length;
    let current = object;

    for (let i = 0; i < size; ++i) {
      if (current == null || !_.isObject(current)) {
        return undefined;
      }

      current = _.result(current, parts[i]);
    }

    return current;
  };

  const setter = (parts, object, value) => {
    const size = parts.length - 1;
    const current = object;
    let result = current;

    for (var i = 0; i < size; ++i) {
      result = _.result(current, parts[i]);
      result = current[parts[i]] = ensureObject(result);
    }

    result[_.last(parts)] = value;
    return value;
  };

  return (key) => {
    if (!cache.contains(key)) {
      const parts = $normalize(key);
      const $getter = object => getter(parts, object);

      $getter.assign = (object, value) => setter(parts, object, value);

      cache.put(key, $getter);
    }

    return cache.get(key);
  };
})();
