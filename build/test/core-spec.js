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

describe('core', function() {

  var $core = require('../core');

  it('should have standalone files', function() {
    var $standalone = $core.$standalone;
    expect($standalone).toEqual([
      'src/core/jq-lite/jq-lite.js',
      'src/core/underscore-lite/underscore-base-lite.js',
      'src/core/underscore-lite/underscore-lite.js',
      'src/core/commons/json.js',
      'src/core/data-structures/map.js',
      'src/core/commons/sniffer.js',
      'src/core/data-structures/stack.js',
      'src/core/commons/parser.js',
      'src/core/commons/sanitize.js',
      'src/core/constants.js',
      'src/core/commons/util.js',
      'src/core/commons/dom.js',
      'src/core/commons/vdom.js',
      'src/core/events/event.js',
      'src/core/events/event-bus.js',
      'src/core/observable/observable.js',
      'src/core/observable/change.js',
      'src/core/services/renderers.js',
      'src/core/services/comparators.js',
      'src/core/services/filters.js',
      'src/core/grid/models/collection.js',
      'src/core/grid/models/column.js',
      'src/core/grid/commons/grid-util.js',
      'src/core/grid/dom/grid-dom-handlers.js',
      'src/core/grid/dom/grid-dom-binders.js',
      'src/core/grid/builder/grid-builder.js',
      'src/core/grid/resize/grid-resizer.js',
      'src/core/grid/observers/grid-data-observer.js',
      'src/core/grid/observers/grid-columns-observer.js',
      'src/core/grid/observers/grid-selection-observer.js',
      'src/core/grid/filter/grid-filter.js',
      'src/core/grid/grid.js',
      'src/core/waffle.js'
    ]);
  });

  it('should have jquery files', function() {
    var $jquery = $core.$jquery;
    expect($jquery).toEqual([
      'src/core/underscore-lite/underscore-base-lite.js',
      'src/core/underscore-lite/underscore-lite.js',
      'src/core/commons/json.js',
      'src/core/data-structures/map.js',
      'src/core/commons/sniffer.js',
      'src/core/data-structures/stack.js',
      'src/core/commons/parser.js',
      'src/core/commons/sanitize.js',
      'src/core/constants.js',
      'src/core/commons/util.js',
      'src/core/commons/dom.js',
      'src/core/commons/vdom.js',
      'src/core/events/event.js',
      'src/core/events/event-bus.js',
      'src/core/observable/observable.js',
      'src/core/observable/change.js',
      'src/core/services/renderers.js',
      'src/core/services/comparators.js',
      'src/core/services/filters.js',
      'src/core/grid/models/collection.js',
      'src/core/grid/models/column.js',
      'src/core/grid/commons/grid-util.js',
      'src/core/grid/dom/grid-dom-handlers.js',
      'src/core/grid/dom/grid-dom-binders.js',
      'src/core/grid/builder/grid-builder.js',
      'src/core/grid/resize/grid-resizer.js',
      'src/core/grid/observers/grid-data-observer.js',
      'src/core/grid/observers/grid-columns-observer.js',
      'src/core/grid/observers/grid-selection-observer.js',
      'src/core/grid/filter/grid-filter.js',
      'src/core/grid/grid.js',
      'src/core/waffle.js',
      'src/extensions/jquery/waffle-jquery.js'
    ]);
  });

  it('should have undercore files', function() {
    var $underscore = $core.$underscore;
    expect($underscore).toEqual([
      'src/extensions/underscore/sanitize.js',
      'src/core/jq-lite/jq-lite.js',
      'src/core/commons/json.js',
      'src/core/data-structures/map.js',
      'src/core/commons/sniffer.js',
      'src/core/data-structures/stack.js',
      'src/core/commons/parser.js',
      'src/core/constants.js',
      'src/core/commons/util.js',
      'src/core/commons/dom.js',
      'src/core/commons/vdom.js',
      'src/core/events/event.js',
      'src/core/events/event-bus.js',
      'src/core/observable/observable.js',
      'src/core/observable/change.js',
      'src/core/services/renderers.js',
      'src/core/services/comparators.js',
      'src/core/services/filters.js',
      'src/core/grid/models/collection.js',
      'src/core/grid/models/column.js',
      'src/core/grid/commons/grid-util.js',
      'src/core/grid/dom/grid-dom-handlers.js',
      'src/core/grid/dom/grid-dom-binders.js',
      'src/core/grid/builder/grid-builder.js',
      'src/core/grid/resize/grid-resizer.js',
      'src/core/grid/observers/grid-data-observer.js',
      'src/core/grid/observers/grid-columns-observer.js',
      'src/core/grid/observers/grid-selection-observer.js',
      'src/core/grid/filter/grid-filter.js',
      'src/core/grid/grid.js',
      'src/core/waffle.js'
    ]);
  });

  it('should have bare files', function() {
    var $bare = $core.$bare;
    expect($bare).toEqual([
      'src/extensions/underscore/sanitize.js',
      'src/core/commons/json.js',
      'src/core/data-structures/map.js',
      'src/core/commons/sniffer.js',
      'src/core/data-structures/stack.js',
      'src/core/commons/parser.js',
      'src/core/constants.js',
      'src/core/commons/util.js',
      'src/core/commons/dom.js',
      'src/core/commons/vdom.js',
      'src/core/events/event.js',
      'src/core/events/event-bus.js',
      'src/core/observable/observable.js',
      'src/core/observable/change.js',
      'src/core/services/renderers.js',
      'src/core/services/comparators.js',
      'src/core/services/filters.js',
      'src/core/grid/models/collection.js',
      'src/core/grid/models/column.js',
      'src/core/grid/commons/grid-util.js',
      'src/core/grid/dom/grid-dom-handlers.js',
      'src/core/grid/dom/grid-dom-binders.js',
      'src/core/grid/builder/grid-builder.js',
      'src/core/grid/resize/grid-resizer.js',
      'src/core/grid/observers/grid-data-observer.js',
      'src/core/grid/observers/grid-columns-observer.js',
      'src/core/grid/observers/grid-selection-observer.js',
      'src/core/grid/filter/grid-filter.js',
      'src/core/grid/grid.js',
      'src/core/waffle.js',
      'src/extensions/jquery/waffle-jquery.js'
    ]);
  });

  it('should have angular files', function() {
    var $angular = $core.$angular;
    expect($angular).toEqual([
      'src/core/underscore-lite/underscore-base-lite.js',
      'src/extensions/angular/underscore-angular.js',
      'src/extensions/angular/jq-angular.js',
      'src/extensions/angular/json-angular.js',
      'src/extensions/angular/waffle-angular-module.js',
      'src/extensions/angular/waffle-angular-run.js',
      'src/core/data-structures/map.js',
      'src/core/constants.js',
      'src/core/commons/util.js',
      'src/core/commons/dom.js',
      'src/core/commons/vdom.js',
      'src/core/events/event.js',
      'src/core/events/event-bus.js',
      'src/core/observable/observable.js',
      'src/core/observable/change.js',
      'src/core/services/renderers.js',
      'src/core/services/comparators.js',
      'src/core/services/filters.js',
      'src/core/grid/models/collection.js',
      'src/core/grid/models/column.js',
      'src/core/grid/commons/grid-util.js',
      'src/core/grid/dom/grid-dom-handlers.js',
      'src/core/grid/dom/grid-dom-binders.js',
      'src/core/grid/builder/grid-builder.js',
      'src/core/grid/resize/grid-resizer.js',
      'src/core/grid/observers/grid-data-observer.js',
      'src/core/grid/observers/grid-columns-observer.js',
      'src/core/grid/observers/grid-selection-observer.js',
      'src/core/grid/filter/grid-filter.js',
      'src/core/grid/grid.js',
      'src/core/waffle.js',
      'src/extensions/angular/waffle-angular-service.js',
      'src/extensions/angular/grid-angular-template.js',
      'src/extensions/angular/grid-compilation-angular.js',
      'src/extensions/angular/grid-angular.js',
      'src/extensions/angular/waffle-angular.js'
    ]);
  });

  it('should have react files', function() {
    var $react = $core.$react;
    expect($react).toEqual([
      'src/core/jq-lite/jq-lite.js',
      'src/core/underscore-lite/underscore-base-lite.js',
      'src/core/underscore-lite/underscore-lite.js',
      'src/core/commons/json.js',
      'src/core/data-structures/map.js',
      'src/core/commons/sniffer.js',
      'src/core/data-structures/stack.js',
      'src/core/commons/parser.js',
      'src/core/commons/sanitize.js',
      'src/core/constants.js',
      'src/core/commons/util.js',
      'src/core/commons/dom.js',
      'src/core/commons/vdom.js',
      'src/core/events/event.js',
      'src/core/events/event-bus.js',
      'src/core/observable/observable.js',
      'src/core/observable/change.js',
      'src/core/services/renderers.js',
      'src/core/services/comparators.js',
      'src/core/services/filters.js',
      'src/core/grid/models/collection.js',
      'src/core/grid/models/column.js',
      'src/core/grid/commons/grid-util.js',
      'src/core/grid/dom/grid-dom-handlers.js',
      'src/core/grid/dom/grid-dom-binders.js',
      'src/core/grid/builder/grid-builder.js',
      'src/core/grid/resize/grid-resizer.js',
      'src/core/grid/observers/grid-data-observer.js',
      'src/core/grid/observers/grid-columns-observer.js',
      'src/core/grid/observers/grid-selection-observer.js',
      'src/core/grid/filter/grid-filter.js',
      'src/core/grid/grid.js',
      'src/core/waffle.js',
      'src/extensions/react/waffle-react-mixin.js',
      'src/extensions/react/waffle-react.js'
    ]);
  });

  it('should have polymer files', function() {
    var $polymer = $core.$polymer;
    expect($polymer).toEqual([
      'src/core/jq-lite/jq-lite.js',
      'src/core/underscore-lite/underscore-base-lite.js',
      'src/core/underscore-lite/underscore-lite.js',
      'src/core/commons/json.js',
      'src/core/data-structures/map.js',
      'src/core/commons/sniffer.js',
      'src/core/data-structures/stack.js',
      'src/core/commons/parser.js',
      'src/core/commons/sanitize.js',
      'src/core/constants.js',
      'src/core/commons/util.js',
      'src/core/commons/dom.js',
      'src/core/commons/vdom.js',
      'src/core/events/event.js',
      'src/core/events/event-bus.js',
      'src/core/observable/observable.js',
      'src/core/observable/change.js',
      'src/core/services/renderers.js',
      'src/core/services/comparators.js',
      'src/core/services/filters.js',
      'src/core/grid/models/collection.js',
      'src/core/grid/models/column.js',
      'src/core/grid/commons/grid-util.js',
      'src/core/grid/dom/grid-dom-handlers.js',
      'src/core/grid/dom/grid-dom-binders.js',
      'src/core/grid/builder/grid-builder.js',
      'src/core/grid/resize/grid-resizer.js',
      'src/core/grid/observers/grid-data-observer.js',
      'src/core/grid/observers/grid-columns-observer.js',
      'src/core/grid/observers/grid-selection-observer.js',
      'src/core/grid/filter/grid-filter.js',
      'src/core/grid/grid.js',
      'src/core/waffle.js',
      'src/extensions/polymer/waffle-polymer.js'
    ]);
  });
});
