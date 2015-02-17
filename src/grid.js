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

var Grid = function(table, options) {
  this.$table = jq(table);

  this.$data = new Collection(options.data || []);
  this.$columns = new Collection(options.columns || [], {
    key: 'id',
    model: Column
  });

  this.init();
};

Grid.prototype = {
  // Initialize grid:
  //  - Create or retrieve thead element
  //  - Create or retrieve tbody element
  init: function() {
    var table = this.$table[0];
    this.$tbody = jq($doc.byTagName('tbody', table));
    this.$thead = jq($doc.byTagName('thead', table));

    if (!this.$thead.length) {
      var thead = $doc.thead();
      this.$thead = jq(thead);
      this.$table.append(thead);
    }

    if (!this.$tbody.length) {
      var tbody = $doc.tbody();
      this.$tbody = jq(tbody);
      this.$table.append(tbody);
    }
  },

  // Render entire grid
  render: function() {
  	return this.renderHeader().renderBody();
  },

  // Render entire header of grid
  renderHeader: function() {
    var $ths = this.$columns.forEach(function(column) {
      var text = column.title;
      return jq($doc.th()).html(text)[0];
    });

    this.$thead.empty().append($ths);
    return this;
  },

  // Render entire body of grid
  renderBody: function() {
    return this;
  },

  destroy: function() {
    for (var i in this) {
      if (this.hasOwnProperty(i)) {
        this[i] = null;
      }
    }

    return this;
  }
};
