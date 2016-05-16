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
/* global ReactDOM */
/* global Waffle */
/* exported WaffleReactMixin */

var WaffleReactMixin = {
  // Get component default props.
  getDefaultProps: function() {
    return {
      waffle: _.clone(Waffle.options)
    };
  },

  // Initialize grid when component will be mounted.
  componentWillMount: function() {
    this.grid = Waffle.create(this.props.waffle);
  },

  // Call just after component has been mount into dom.
  // This step is used to initialized grid.
  componentDidMount: function() {
    var domNode = ReactDOM.findDOMNode(this);
    this.grid.attach(domNode);
  },

  // Call just before component is destroyed.
  componentWillUnmount: function() {
    this.grid.destroy();
  },

  // Update will be handled by Waffle.
  shouldComponentUpdate: function() {
    return false;
  },

  // If state is updated, then render everything.
  componentDidUpdate: function() {
    this.grid.render();
  },

  // Get created grid.
  getGrid: function() {
    return this.grid;
  }
};
