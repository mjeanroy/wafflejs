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

/**
 * Build arrays of source files in order.
 * Exported module is an object:
 * - Key is the target waffle build (prefixed with '$').
 * - Value is an array of source files to concatenate to build waffle extension.
 */

var _ = require('underscore');
var config = require('./config');

var $files = {
  $jqLite: [
    'core/jq-lite/jq-lite.js'
  ],

  $underscoreLite: [
    'core/underscore-lite/underscore-base-lite.js',
    'core/underscore-lite/underscore-lite.js'
  ],

  $json: [
    'core/commons/json.js'
  ],

  $parser: [
    'core/data-structures/stack.js',
    'core/commons/parser.js'
  ],

  $sanitize: [
    'core/commons/sanitize.js'
  ],

  $map: [
    'core/data-structures/map.js'
  ],

  $sniffer: [
    'core/commons/sniffer.js'
  ],

  $core: [
    'core/constants.js',
    'core/commons/util.js',
    'core/commons/dom.js',
    'core/commons/vdom.js',
    'core/events/event.js',
    'core/events/event-bus.js',
    'core/observable/observable.js',
    'core/observable/change.js',
    'core/services/renderers.js',
    'core/services/comparators.js',
    'core/services/filters.js',
    'core/grid/models/collection.js',
    'core/grid/models/column.js',
    'core/grid/commons/grid-util.js',
    'core/grid/dom/grid-dom-handlers.js',
    'core/grid/dom/grid-dom-binders.js',
    'core/grid/builder/grid-builder.js',
    'core/grid/resize/grid-resizer.js',
    'core/grid/observers/grid-data-observer.js',
    'core/grid/observers/grid-columns-observer.js',
    'core/grid/observers/grid-selection-observer.js',
    'core/grid/filter/grid-filter.js',
    'core/grid/grid.js',
    'core/waffle.js'
  ]
};

var $core = {
  $standalone: [
    '$jqLite',
    '$underscoreLite',
    '$json',
    '$map',
    '$sniffer',
    '$parser',
    '$sanitize',
    '$core'
  ],

  $jquery: [
    '$underscoreLite',
    '$json',
    '$map',
    '$sniffer',
    '$parser',
    '$sanitize',
    '$core',
    'extensions/jquery/waffle-jquery.js'
  ],

  $underscore: [
    'extensions/underscore/sanitize.js',
    '$jqLite',
    '$json',
    '$map',
    '$sniffer',
    '$parser',
    '$core'
  ],

  $bare: [
    'extensions/underscore/sanitize.js',
    '$json',
    '$map',
    '$sniffer',
    '$parser',
    '$core',
    'extensions/jquery/waffle-jquery.js'
  ],

  $angular: [
    'core/underscore-lite/underscore-base-lite.js',
    'extensions/angular/underscore-angular.js',
    'extensions/angular/jq-angular.js',
    'extensions/angular/json-angular.js',
    'extensions/angular/waffle-angular-module.js',
    'extensions/angular/waffle-angular-run.js',

    '$map',
    '$core',

    'extensions/angular/waffle-angular-service.js',
    'extensions/angular/grid-angular-template.js',
    'extensions/angular/grid-compilation-angular.js',
    'extensions/angular/grid-angular.js'
  ],

  $react: [
    '$standalone',
    'extensions/react/waffle-react-mixin.js',
    'extensions/react/waffle-react.js'
  ],

  $polymer: [
    '$standalone',
    'extensions/polymer/waffle-polymer.js'
  ]
};

// Replace placeholders
var hasPlaceholder = function(src) {
  return src.charAt(0) === '$';
};

var replacePlaceholder = function(src) {
  return hasPlaceholder(src) ? $files[src] || $core[src] : src;
};

var mapPlaceholder = function(src) {
  var ended = false;
  var result = src;

  while (!ended) {
    var array = _.isArray(result) ? result : [result];

    result = _.chain(array)
      .map(replacePlaceholder)
      .flatten()
      .value();

    ended = _.every(result, _.negate(hasPlaceholder));
  }

  return result;
};

// Prepend src path
var prependPath = function(src) {
  return config.src + src;
};

var result = _.mapObject($core, function(value) {
  return _.chain(value)
    .map(mapPlaceholder)
    .flatten()
    .map(prependPath)
    .value();
});

module.exports = result;
