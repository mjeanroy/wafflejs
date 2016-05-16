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
/* global $events */
/* global HashMap */
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

const Column = (() => {

  const DEFAULT_EDITABLE = {
    enable: true,
    type: 'text',
    css: null,
    debounce: 0
  };

  const CSS_PLACHOLDERS = {
    '.': '-',
    '(': '',
    ')': '',
    '[': '-',
    ']': '-',
    '\'': '',
    '"': ''
  };

  const isUndefined = _.isUndefined;
  const defaultRenderer = '$identity';
  const defaultComparator = '$auto';

  // Save bytes
  const resultWith = $util.resultWith;
  const fromPx = $util.fromPx;
  const toPx = $util.toPx;

  const lookup = (value, dictionary, defaultValue) => {
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

  return class Column {
    constructor(column) {
      // If a string is given as parameter, then this is a
      // shortcut for column id.
      if (_.isString(column)) {
        column = {
          id: column
        };
      }

      const escape = column.escape;
      const sortable = column.sortable;

      this.id = column.id;
      this.title = column.title || '';
      this.field = column.field || this.id;
      this.css = column.css || '';
      this.escape = isUndefined(escape) ? true : !!escape;
      this.width = column.width;
      this.sortable = isUndefined(sortable) ? true : !!sortable;
      this.draggable = !!column.draggable;

      // On initialization, column is not sorted
      // Use grid 'sortBy' option instead.
      this.asc = null;

      // Editable column
      let editable = column.editable === true ? {} : column.editable;
      if (editable) {
        editable = _.defaults(editable, DEFAULT_EDITABLE);
        editable.updateOn = editable.updateOn || $events.$defaults(editable.type);
      }

      this.editable = editable;

      if (!this.css) {
        // Use id as default css.
        // Normalize css format : remove undesirable characters
        for (let i = 0, size = this.id.length; i < size; ++i) {
          const current = this.id.charAt(i);
          const placeholder = CSS_PLACHOLDERS[current];
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
      const columnRenderer = column.renderer || defaultRenderer;
      const renderers = _.isArray(columnRenderer) ? columnRenderer : [columnRenderer];
      this.$renderer = _.map(renderers, r => lookup(r, $renderers, defaultRenderer));

      // Comparator can be defined as a custom function
      // Or it could be defined a string which is a shortcut to a pre-built comparator
      // If it is not a function, switch to default comparator
      this.$comparator = lookup(column.comparator, $comparators, defaultComparator);

      // Parse that will be used to extract data value from plain old javascript object
      this.$parser = $parse(this.field);

      // Create debouncers map
      this.$debouncers = new HashMap();
    }

    // Get css class to append to each cell
    cssClasses(idx, header, data) {
      const args = data ? [data] : [];

      let css = resultWith(this.css, this, args);
      if (_.isArray(css)) {
        css = css.join(' ');
      }

      const classes = [css];

      if (this.sortable) {
        // Add css to display that column is sortable
        classes.push(CSS_SORTABLE);
      }

      if (this.draggable) {
        classes.push(CSS_DRAGGABLE);
      }

      // Add css to display current sort
      const asc = this.asc;
      if (asc != null) {
        classes.push(asc ? CSS_SORTABLE_ASC : CSS_SORTABLE_DESC);
      }

      return classes.join(' ');
    }

    // Compute attributes to set on each cell
    attributes(idx, header) {
      const attributes = {
        [DATA_WAFFLE_ID]: this.id
      };

      // Set sort information as custom attributes
      if (header) {
        if (this.sortable) {
          attributes[DATA_WAFFLE_SORTABLE] = true;

          const asc = this.asc;
          if (asc != null) {
            attributes[DATA_WAFFLE_ORDER] = asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
          }
        }

        if (this.draggable) {
          attributes.draggable = true;
        }
      }

      return attributes;
    }

    // Compute inline style to set on each cell
    styles() {
      const styles = {};

      // Set width as inline style
      const computedWidth = toPx(this.computedWidth);
      if (computedWidth) {
        styles.width = computedWidth;
        styles.maxWidth = computedWidth;
        styles.minWidth = computedWidth;
      }

      return styles;
    }

    // Update column fixed width
    updateWidth(width) {
      this.width = fromPx(width);
      return this;
    }

    // Check if column or given data is editable
    isEditable(data) {
      // It may be always false
      if (!this.editable || !this.editable.enable) {
        return false;
      }

      // May be call without argument
      if (!data) {
        return true;
      }

      // If call with an argument, this will be used to check if data
      // is editable or not.
      return resultWith(this.editable.enable, this, [data]);
    }

    // Check if column handle this particular event.
    handleEvent(event) {
      return this.isEditable() &&
        this.editable.updateOn.match(new RegExp('(\\s|^)' + event + '(\\s|$)')) !== null;
    }

    // Render object using column settings
    render(object) {
      // Extract value
      const field = this.field;
      const value = this.value(object);

      // Give extracted value as the first parameter
      // Give object as the second parameter to allow more flexibility
      // Give field to display as the third parameter to allow more flexibility
      // Use '$renderers' as this context, this way renderers can be easy compose
      const rendererValue = _.reduce(this.$renderer, (val, r) => r.call($renderers, val, object, field), value);

      // If value is null or undefined, fallback to an empty string
      if (rendererValue == null) {
        return '';
      }

      return this.escape ? $sanitize(rendererValue) : rendererValue;
    }

    // Get or set value of object using column settings (parser).
    value(object, value) {
      const parser = this.$parser;

      if (arguments.length === 2) {
        parser.assign(object, value);
        return this;
      } else {
        return object == null ? '' : parser(object);
      }
    }
  };
})();
