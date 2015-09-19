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

/* global _ */
/* global $doc */
/* global GridBuilder */
/* global WaffleReactMixin */
/* global React */
/* exported WaffleComponent */

var WaffleComponent = React.createClass({
  // React display name.
  displayName: 'Waffle',

  // Define mixin to handle component lifecycle.
  mixins: [WaffleReactMixin],

  // Render a simple table.
  // Everything else will be rendered using Waffle.
  render: function() {
    var $docCreate = $doc.create;

    // React will create element.
    $doc.create = React.createElement;

    // Get a local reference.
    var grid = this.grid;

    // Initialize main dom nodes.
    var children = [];

    // Append rows.
    children.push(React.DOM.tbody(null, _.map(this.grid.visibleData(), function(current, idx) {
      return GridBuilder.tbodyRow(grid, current, idx);
    })));

    // Unshift header.
    if (grid.hasHeader()) {
      children.unshift(React.DOM.thead(null, GridBuilder.theadRow(grid)));
    }

    // Append footer..
    if (grid.hasFooter()) {
      children.push(React.DOM.tfoot(null, GridBuilder.tfootRow(grid)));
    }

    // Initialize props.
    var props = _.clone(this.props);

    // Get css classes.
    // Do not forget to keep original classes.
    var className = props.className || '';
    if (_.isArray(className)) {
      className = className.join(' ');
    }

    // Append waffle classes
    className += ' ' + this.grid.cssClasses().join(' ');

    // Set css classes
    props.className = className;

    // Create react element.
    var table = React.DOM.table(props, children);

    // Restore original function.
    $doc.create = $docCreate;

    return table;
  },
});
