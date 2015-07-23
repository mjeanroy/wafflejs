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

describe('waffle-files', function() {

  var $file = require('./waffle-files');

  it('should have targets', function() {
    expect($file.standalone).toBeDefined();
    expect($file.jquery).toBeDefined();
    expect($file.underscore).toBeDefined();
    expect($file.bare).toBeDefined();
    expect($file.angular).toBeDefined();
    expect($file.polymer).toBeDefined();
  });

  describe('standalone', function() {
    var $standalone = $file.standalone;

    it('should have source files', function() {
      expect($standalone.src).toBeDefined();
      expect($standalone.src).toContainsDistinctValues();
      expect($standalone.src).toVerify(function(file) {
        return file.trim().slice(0, 4) === 'src/';
      });

      expect($standalone.src).toEqual([
        'src/jq-lite.js',
        'src/underscore-base-lite.js',
        'src/underscore-lite.js',
        'src/json.js',
        'src/map.js',
        'src/sniffer.js',
        'src/parser.js',
        'src/sanitize.js',
        'src/constants.js',
        'src/util.js',
        'src/dom.js',
        'src/vdom.js',
        'src/event-bus.js',
        'src/observable.js',
        'src/collection.js',
        'src/renderers.js',
        'src/comparators.js',
        'src/column.js',
        'src/grid-dom-handlers.js',
        'src/grid-dom-binders.js',
        'src/grid-builder.js',
        'src/grid-resizer.js',
        'src/grid-data-observer.js',
        'src/grid-columns-observer.js',
        'src/grid-selection-observer.js',
        'src/grid.js',
        'src/waffle.js'
      ]);
    });

    it('should have spec files', function() {
      expect($standalone.test).toBeDefined();
      expect($standalone.test).toContainsDistinctValues();
    });

    it('should have vendors files', function() {
      expect($standalone.vendor).toBeDefined();
      expect($standalone.vendor).toBeEmpty();
    });

    it('should have a template', function() {
      expect($standalone.template).toBe('wrap-template-standalone.js');
    });
  });

  describe('jquery', function() {
    var $jquery = $file.jquery;

    it('should have source files', function() {
      expect($jquery.src).toBeDefined();
      expect($jquery.src).toContainsDistinctValues();
      expect($jquery.src).toVerify(function(file) {
        return file.trim().slice(0, 4) === 'src/';
      });

      expect($jquery.src).toEqual([
        'src/underscore-base-lite.js',
        'src/underscore-lite.js',
        'src/json.js',
        'src/map.js',
        'src/sniffer.js',
        'src/parser.js',
        'src/sanitize.js',
        'src/constants.js',
        'src/util.js',
        'src/dom.js',
        'src/vdom.js',
        'src/event-bus.js',
        'src/observable.js',
        'src/collection.js',
        'src/renderers.js',
        'src/comparators.js',
        'src/column.js',
        'src/grid-dom-handlers.js',
        'src/grid-dom-binders.js',
        'src/grid-builder.js',
        'src/grid-resizer.js',
        'src/grid-data-observer.js',
        'src/grid-columns-observer.js',
        'src/grid-selection-observer.js',
        'src/grid.js',
        'src/waffle.js',
        'src/jquery/waffle-jquery.js'
      ]);
    });

    it('should have spec files', function() {
      expect($jquery.test).toBeDefined();
      expect($jquery.test).toContainsDistinctValues();
    });

    it('should have vendors files', function() {
      expect($jquery.vendor).toBeDefined();
      expect($jquery.vendor).not.toBeEmpty();

      expect($jquery.vendor).toVerify(function(file) {
        return file.trim().slice(0, 8) === 'vendors/';
      });

      expect($jquery.vendor).toEqual([
        'vendors/jquery/dist/jquery.js'
      ]);
    });

    it('should have a template', function() {
      expect($jquery.template).toBe('wrap-template-jquery.js');
    });
  });

  describe('underscore', function() {
    var $underscore = $file.underscore;

    it('should have source files', function() {
      expect($underscore.src).toBeDefined();
      expect($underscore.src).toContainsDistinctValues();
      expect($underscore.src).toVerify(function(file) {
        return file.trim().slice(0, 4) === 'src/';
      });

      expect($underscore.src).toEqual([
        'src/jq-lite.js',
        'src/json.js',
        'src/map.js',
        'src/sniffer.js',
        'src/parser.js',
        'src/underscore/sanitize.js',
        'src/constants.js',
        'src/util.js',
        'src/dom.js',
        'src/vdom.js',
        'src/event-bus.js',
        'src/observable.js',
        'src/collection.js',
        'src/renderers.js',
        'src/comparators.js',
        'src/column.js',
        'src/grid-dom-handlers.js',
        'src/grid-dom-binders.js',
        'src/grid-builder.js',
        'src/grid-resizer.js',
        'src/grid-data-observer.js',
        'src/grid-columns-observer.js',
        'src/grid-selection-observer.js',
        'src/grid.js',
        'src/waffle.js'
      ]);
    });

    it('should have spec files', function() {
      expect($underscore.test).toBeDefined();
      expect($underscore.test).toContainsDistinctValues();
    });

    it('should have vendors files', function() {
      expect($underscore.vendor).toBeDefined();
      expect($underscore.vendor).not.toBeEmpty();

      expect($underscore.vendor).toVerify(function(file) {
        return file.trim().slice(0, 8) === 'vendors/';
      });

      expect($underscore.vendor).toEqual([
        'vendors/underscore/underscore.js'
      ]);
    });

    it('should have a template', function() {
      expect($underscore.template).toBe('wrap-template-underscore.js');
    });
  });

  describe('bare', function() {
    var $bare = $file.bare;

    it('should have source files', function() {
      expect($bare.src).toBeDefined();
      expect($bare.src).toContainsDistinctValues();
      expect($bare.src).toVerify(function(file) {
        return file.trim().slice(0, 4) === 'src/';
      });

      expect($bare.src).toEqual([
        'src/json.js',
        'src/map.js',
        'src/sniffer.js',
        'src/parser.js',
        'src/underscore/sanitize.js',
        'src/constants.js',
        'src/util.js',
        'src/dom.js',
        'src/vdom.js',
        'src/event-bus.js',
        'src/observable.js',
        'src/collection.js',
        'src/renderers.js',
        'src/comparators.js',
        'src/column.js',
        'src/grid-dom-handlers.js',
        'src/grid-dom-binders.js',
        'src/grid-builder.js',
        'src/grid-resizer.js',
        'src/grid-data-observer.js',
        'src/grid-columns-observer.js',
        'src/grid-selection-observer.js',
        'src/grid.js',
        'src/waffle.js',
        'src/jquery/waffle-jquery.js'
      ]);
    });

    it('should have spec files', function() {
      expect($bare.test).toBeDefined();
      expect($bare.test).toContainsDistinctValues();
    });

    it('should have vendors files', function() {
      expect($bare.vendor).toBeDefined();
      expect($bare.vendor).not.toBeEmpty();

      expect($bare.vendor).toVerify(function(file) {
        return file.trim().slice(0, 8) === 'vendors/';
      });

      expect($bare.vendor).toEqual([
        'vendors/jquery/dist/jquery.js',
        'vendors/underscore/underscore.js'
      ]);
    });

    it('should have a template', function() {
      expect($bare.template).toBe('wrap-template-bare.js');
    });
  });

  describe('angular', function() {
    var $angular = $file.angular;

    it('should have source files', function() {
      expect($angular.src).toBeDefined();
      expect($angular.src).toContainsDistinctValues();
      expect($angular.src).toVerify(function(file) {
        return file.trim().slice(0, 4) === 'src/';
      });

      expect($angular.src).toEqual([
        'src/underscore-base-lite.js',
        'src/angular/underscore-angular.js',
        'src/angular/jq-angular.js',
        'src/angular/json-angular.js',
        'src/angular/waffle-angular-module.js',
        'src/angular/waffle-angular-run.js',
        'src/map.js',
        'src/constants.js',
        'src/util.js',
        'src/dom.js',
        'src/vdom.js',
        'src/event-bus.js',
        'src/observable.js',
        'src/collection.js',
        'src/renderers.js',
        'src/comparators.js',
        'src/column.js',
        'src/grid-dom-handlers.js',
        'src/grid-dom-binders.js',
        'src/grid-builder.js',
        'src/grid-resizer.js',
        'src/grid-data-observer.js',
        'src/grid-columns-observer.js',
        'src/grid-selection-observer.js',
        'src/grid.js',
        'src/waffle.js',
        'src/angular/waffle-angular-service.js',
        'src/angular/grid-angular-template.js',
        'src/angular/grid-angular.js'
      ]);
    });

    it('should have spec files', function() {
      expect($angular.test).toBeDefined();
      expect($angular.test).toContainsDistinctValues();
    });

    it('should have vendors files', function() {
      expect($angular.vendor).toBeDefined();
      expect($angular.vendor).not.toBeEmpty();

      expect($angular.vendor).toVerify(function(file) {
        return file.trim().slice(0, 8) === 'vendors/';
      });

      expect($angular.vendor).toEqual([
        'vendors/angular/angular.js',
        'vendors/angular-sanitize/angular-sanitize.js'
      ]);
    });

    it('should have a template', function() {
      expect($angular.template).toBe('wrap-template-angular.js');
    });
  });

  describe('polymer', function() {
    var $polymer = $file.polymer;

    it('should have source files', function() {
      expect($polymer.src).toBeDefined();
      expect($polymer.src).toContainsDistinctValues();
      expect($polymer.src).toVerify(function(file) {
        return file.trim().slice(0, 4) === 'src/';
      });

      expect($polymer.src).toEqual([
        'src/jq-lite.js',
        'src/underscore-base-lite.js',
        'src/underscore-lite.js',
        'src/json.js',
        'src/map.js',
        'src/sniffer.js',
        'src/parser.js',
        'src/sanitize.js',
        'src/constants.js',
        'src/util.js',
        'src/dom.js',
        'src/vdom.js',
        'src/event-bus.js',
        'src/observable.js',
        'src/collection.js',
        'src/renderers.js',
        'src/comparators.js',
        'src/column.js',
        'src/grid-dom-handlers.js',
        'src/grid-dom-binders.js',
        'src/grid-builder.js',
        'src/grid-resizer.js',
        'src/grid-data-observer.js',
        'src/grid-columns-observer.js',
        'src/grid-selection-observer.js',
        'src/grid.js',
        'src/waffle.js',
        'src/polymer/waffle-polymer.js'
      ]);
    });

    it('should have spec files', function() {
      expect($polymer.test).toBeDefined();
      expect($polymer.test).toContainsDistinctValues();
    });

    it('should have vendors files', function() {
      expect($polymer.vendor).toBeDefined();
      expect($polymer.vendor).toBeEmpty();
    });

    it('should have a template', function() {
      expect($polymer.template).toBe('wrap-template-polymer.js');
    });
  });

  describe('react', function() {
    var $react = $file.react;

    it('should have source files', function() {
      expect($react.src).toBeDefined();
      expect($react.src).toContainsDistinctValues();
      expect($react.src).toVerify(function(file) {
        return file.trim().slice(0, 4) === 'src/';
      });

      expect($react.src).toEqual([
        'src/jq-lite.js',
        'src/underscore-base-lite.js',
        'src/underscore-lite.js',
        'src/json.js',
        'src/map.js',
        'src/sniffer.js',
        'src/parser.js',
        'src/sanitize.js',
        'src/constants.js',
        'src/util.js',
        'src/dom.js',
        'src/vdom.js',
        'src/event-bus.js',
        'src/observable.js',
        'src/collection.js',
        'src/renderers.js',
        'src/comparators.js',
        'src/column.js',
        'src/grid-dom-handlers.js',
        'src/grid-dom-binders.js',
        'src/grid-builder.js',
        'src/grid-resizer.js',
        'src/grid-data-observer.js',
        'src/grid-columns-observer.js',
        'src/grid-selection-observer.js',
        'src/grid.js',
        'src/waffle.js',
        'src/react/waffle-react-mixin.js',
        'src/react/waffle-react.js'
      ]);
    });

    it('should have spec files', function() {
      expect($react.test).toBeDefined();
      expect($react.test).toContainsDistinctValues();
    });

    it('should have vendors files', function() {
      expect($react.vendor).toBeDefined();
      expect($react.vendor).toEqual([
        'vendors/es5-shim/es5-shim.js',
        'vendors/react/react-with-addons.js'
      ]);
    });

    it('should have a template', function() {
      expect($react.template).toBe('wrap-template-react.js');
    });
  });
});