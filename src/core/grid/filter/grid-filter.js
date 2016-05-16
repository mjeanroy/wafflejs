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

const GridFilter = (() => {

  return {
    applyFilter: function(predicate) {
      // Create a function that return always true if first
      // argument is not defined.
      const filterFunction = predicate == null ? _.constant(true) : predicate;

      const filterIteratee = function(accumulator, current, idx) {
        const tbody = this.$tbody[0];
        const rows = tbody.childNodes;
        const ctx = this.$data.ctx(current);
        const wasVisible = _.isUndefined(ctx.visible) ? true : !!ctx.visible;
        const isVisible = !!filterFunction(current);

        let inc = 0;
        let removedRow = null;

        // Update flag
        ctx.visible = isVisible;

        if (wasVisible !== isVisible) {
          const currentRow = rows[ctx.idx - accumulator.nbFiltered];
          if (isVisible) {
            const tr = GridBuilder.tbodyRow(this, current, idx);
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

      const accumulator = {
        nbFiltered: 0,
        removed: []
      };

      const result = this.$data.reduce(filterIteratee, accumulator, this);

      // Trigger event !
      const nbFiltered = result.nbFiltered;
      const removedNodes = result.removed;

      this.dispatchEvent('filterupdated', {
        predicate: predicate,
        countVisible: this.$data.size() - nbFiltered,
        countFiltered: nbFiltered,
        removedNodes: removedNodes
      });
    }
  };
})();
