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

/* exported $parse */
/* exported $sanitize */
/* exported $sniffer */
/* global _ */
/* global $renderers */
/* global waffleModule */

// Use $parse and $sanitize services from angularjs framework

let $parse;
let $sanitize;
let $sniffer;
let $compile;

waffleModule.run(['$injector', '$log', '$filter', ($injector, $log, $filter) => {
  // Service $parse is a mandatory module
  $parse = $injector.get('$parse');
  $sniffer = $injector.get('$sniffer');
  $compile = $injector.get('$compile');

  try {
    $sanitize = $injector.get('$sanitize');
  } catch (e) {
    // At least, log a warning
    $log.warn('Module ngSanitize is not available, you should add this module to avoid xss injection');

    // Fallback to identity function, should it be better ?
    $sanitize = _.identity;
  }

  // Override $renderers lookup
  const $getRenderer = $renderers.$get;
  $renderers.$get = name => {
    // An angular fitler should be a waffle renderer.
    // Native waffle renderer should be check first.
    return $getRenderer(name) || $filter(name);
  };
}]);
