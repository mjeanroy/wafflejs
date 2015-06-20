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
/* global $parse */
/* global $sanitize */
/* global $renderers */
/* global $comparators */
/* global $util */
/* global CSS_SORTABLE */
/* global CSS_SORTABLE_DESC */
/* global CSS_SORTABLE_ASC */
/* global CSS_DRAGGABLE */
/* global CHAR_ORDER_ASC */
/* global CHAR_ORDER_DESC */
/* global DATA_WAFFLE_ID */
/* global DATA_WAFFLE_ORDER */
/* global DATA_WAFFLE_SORTABLE */
/* exported Column */

var Column = (function() {

  var CSS_PLACHOLDERS = {
    '.': '-',
    '(': '',
    ')': '',
    '[': '-',
    ']': '-',
    '\'': '',
    '"': ''
  };

  var isUndefined = _.isUndefined;
  var defaultRenderer = '$identity';
  var defaultComparator = '$auto';

  // Save bytes
  var fromPx = $util.fromPx;
  var toPx = $util.toPx;

  var lookup = function(value, dictionary, defaultValue) {
    // If value is a string, search in given dictionary
    if (_.isString(value)) {
      value = dictionary.$get(value);
    }

    // If it is not a function then use default value in dictionary
    if (!_.isFunction(value)) {
      value = dictionary.$get(defaultValue);
    }

    return value;
  };

  var Constructor = function(column) {
    var escape = column.escape;
    var sortable = column.sortable;

    this.id = column.id;
    this.title = column.title || '';
    this.field = column.field || this.id;
    this.css = column.css || '';
    this.escape = isUndefined(escape) ? true : !!escape;
    this.width = fromPx(column.width);
    this.sortable = isUndefined(sortable) ? true : !!sortable;
    this.draggable = !!column.draggable;
    this.asc = isUndefined(column.asc) ? null : !!column.asc;

    // Editable column
    var editable = column.editable === true ? {} : column.editable;
    if (editable) {
      editable = _.defaults(editable, {
        type: 'text',
        css: null
      });
    }

    this.editable = editable;

    if (!this.css) {
      // Use id as default css.
      // Normalize css format : remove undesirable characters
      for (var i = 0, size = this.id.length; i < size; ++i) {
        var current = this.id.charAt(i);
        var placeholder = CSS_PLACHOLDERS[current];
        this.css += placeholder != null ? placeholder : current;
      }
    }

    // Sanitize input at construction
    if (escape) {
      this.title = $sanitize(this.title);
    }

    // Renderer can be defined as a custom function
    // Or it could be defined a string which is a shortcut to a pre-built renderer
    // If it is not a function, switch to default renderer
    // TODO Is it really a good idea ? Should we allow more flexibility ?
    var columnRenderer = column.renderer || defaultRenderer;
    var renderers = _.isArray(columnRenderer) ? columnRenderer : [columnRenderer];
    this.$renderer = _.map(renderers, function(r) {
      return lookup(r, $renderers, defaultRenderer);
    });

    // Comparator can be defined as a custom function
    // Or it could be defined a string which is a shortcut to a pre-built comparator
    // If it is not a function, switch to default comparator
    this.$comparator = lookup(column.comparator, $comparators, defaultComparator);

    // Parse that will be used to extract data value from plain old javascript object
    this.$parser = $parse(this.field);
  };

  Constructor.prototype = {
    // Get css class to append to each cell
    cssClasses: function() {
      var classes = [this.css];

      if (this.sortable) {
        // Add css to display that column is sortable
        classes.push(CSS_SORTABLE);
      }

      if (this.draggable) {
        classes.push(CSS_DRAGGABLE);
      }

      // Add css to display current sort
      var asc = this.asc;
      if (asc != null) {
        classes.push(asc ? CSS_SORTABLE_ASC : CSS_SORTABLE_DESC);
      }

      return classes.join(' ');
    },

    // Compute attributes to set on each cell
    attributes: function(idx, header) {
      var attributes = {};

      // Set id of column as custom attribute
      attributes[DATA_WAFFLE_ID] = this.id;

      // Set sort information as custom attributes
      if (header) {
        if (this.sortable) {
          attributes[DATA_WAFFLE_SORTABLE] = true;

          var asc = this.asc;
          if (asc != null) {
            attributes[DATA_WAFFLE_ORDER] = asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
          }
        }

        if (this.draggable) {
          attributes.draggable = true;
        }
      }

      return attributes;
    },

    // Compute inline style to set on each cell
    styles: function() {
      var styles = {};

      // Set width as inline style
      var width = toPx(this.width);
      if (width) {
        styles.width = width;
        styles.maxWidth = width;
        styles.minWidth = width;
      }

      return styles;
    },

    // Update column fixed width
    updateWidth: function(width) {
      this.width = fromPx(width);
      return this;
    },

    // Render object using column settings
    render: function(object) {
      // Extract value
      var field = this.field;
      var value = this.value(object);

      // Give extracted value as the first parameter
      // Give object as the second parameter to allow more flexibility
      // Give field to display as the third parameter to allow more flexibility
      // Use '$renderers' as this context, this way renderers can be easy compose
      var rendererValue = _.reduce(this.$renderer, function(val, r) {
        return r.call($renderers, val, object, field);
      }, value);

      // If value is null or undefined, fallback to an empty string
      if (rendererValue == null) {
        return '';
      }

      return this.escape ? $sanitize(rendererValue) : rendererValue;
    },

    // Get or set value of object using column settings (parser).
    value: function(object, value) {
      var parser = this.$parser;

      if (arguments.length === 2) {
        parser.assign(object, value);
        return this;
      } else {
        return object == null ? '' : parser(object);
      }
    }
  };

  return Constructor;
})();
