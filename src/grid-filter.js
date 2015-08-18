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

/* jshint eqnull: true */
/* global _ */
/* global GridBuilder */
/* exported GridFilter */

var GridFilter = (function() {

  var o = {
    applyFilter: function(predicate) {
      // Create a function that return always true if first
      // argument is not defined.
      var filterFunction = predicate == null ? _.constant(true) : predicate;

      var filterIteratee = function(accumulator, current, idx) {
        var tbody = this.$tbody[0];
        var rows = tbody.childNodes;
        var ctx = this.$data.ctx(current);
        var wasVisible = _.isUndefined(ctx.visible) ? true : !!ctx.visible;
        var isVisible = !!filterFunction(current);

        var inc = 0;
        var removedRow = null;

        // Update flag
        ctx.visible = isVisible;

        if (wasVisible !== isVisible) {
          var currentRow = rows[ctx.idx - accumulator.nbFiltered];
          if (isVisible) {
            var tr = GridBuilder.tbodyRow(this, current, idx);
            tbody.insertBefore(tr, currentRow);
          } else {
            removedRow = tbody.removeChild(currentRow);
            inc++;
          }
        } else if (!isVisible) {
          inc++;
        }

        accumulator.nbFiltered += inc;

        if (removedRow) {
          accumulator.removed.push(removedRow);
        }

        return accumulator;
      };

      var accumulator = {
        nbFiltered: 0,
        removed: []
      };

      var result = this.$data.reduce(filterIteratee, accumulator, this);

      // Trigger event !
      var nbFiltered = result.nbFiltered;
      var removedNodes = result.removed;

      this.dispatchEvent('filterupdated', {
        predicate: predicate,
        countVisible: this.$data.size() - nbFiltered,
        countFiltered: nbFiltered,
        removedNodes: removedNodes
      });
    }
  };

  return o;
})();
