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
/* global $compile */
/* global $vdom */
/* global HashMap */
/* global GridBuilder */
/* global DATA_WAFFLE_CID */
/* exported NgCompilator */

const NgCompilator = (() => {

  // Store created child scopes to be able to destroy it properly.
  // In previous releases of angular, we could rely on core
  // angular.element(row).scope() method but it can be disabled in production.
  // We must store created scope internally to get them later and destroy it.
  // This is a dictionnary:
  // - Each row has a unique cid (accross all grids).
  // - This dictionnary associate row cid to the scope.
  const scopes = new HashMap();

  // Compile row (i.e associate row to a newly created scope).
  // A new scope will be created inheriting from the parent scope.
  // This scope will store new variables:
  // - The data.
  // - Index of data.
  const ngCompile = (parentScope, node, data, index) => {
    const $scope = parentScope.$new();

    // Add data to child scope
    $scope.$data = data;
    $scope.$index = index;

    // Store scope to be able to destroy it later
    const cid = node.getAttribute(DATA_WAFFLE_CID);

    // If a current scope exist, destroy it.
    const currentScope = scopes.get(cid);
    if (currentScope) {
      currentScope.$destroy();
    }

    scopes.put(cid, $scope);

    // Compile and link
    return $compile(node)($scope)[0];
  };

  // Refresh scope:
  // - Destroy old scope.
  // - Recreate new one.
  const refreshScope = node => {
    const cid = node.getAttribute(DATA_WAFFLE_CID);

    if (cid) {
      const scope = scopes.get(cid);
      if (scope) {
        node = ngCompile(scope.$parent, node, scope.$data, scope.$index);
      }
    }

    return node;
  };

  // Destroy scope (or a list of scope) associated to given rows.
  // If first argument is an array, then each scope associated to the given
  // rows will be destroyed. If it is not an array, then a single scope will
  // be destroyed.
  const ngDestroy = cids => {
    if (!_.isArray(cids)) {
      cids = [cids];
    }

    // Destroy each scope
    _.forEach(cids, cid => {
      // Get scope associated to row or cid.
      const key = _.isElement(cid) ? cid.getAttribute(DATA_WAFFLE_CID) : cid;
      const scope = scopes.get(key);

      // If scope does not exist, then this is a no-op.
      if (scope) {
        // Destroy single scope.
        scope.$destroy();

        // And remove entry.
        scopes.remove(key);
      }
    });
  };

  // == Some core methods need to be proxified
  // - When a row is created, it may be linked to a scope.
  // - When a temporary is created to apply dom diff, a temporary scope may
  //   have been created and we should destroy it properly.

  // Wrap original builder to build a custom scope for each created rows
  GridBuilder.tbodyRow = _.wrap(GridBuilder.tbodyRow, function(original, grid, data, idx) {
    let tr = original.apply(this, _.rest(arguments));

    // If ng-compilation is enable on the grid, then created row must
    // be linked to a new scope.
    const ng = grid.options.ng;
    if (ng) {
      tr = ngCompile(ng.$scope, tr, data, idx);
    }

    return tr;
  });

  // New node may have been created to compute difference between old row
  // and new row. It means that temporary scope may have been created: we
  // have to destroy it properly to prevent memory leaks.
  $vdom.mergeNodes = _.wrap($vdom.mergeNodes, function(original, parent, oldNode, newNode) {
    const result = original.apply(this, _.rest(arguments));

    // If merged node is a row, then a scope may have been created.
    if (result.tagName === 'TR') {
      const cid = newNode.getAttribute(DATA_WAFFLE_CID);
      if (cid) {
        ngDestroy(cid);
      }
    }

    return result;
  });

  return {
    refresh: refreshScope,
    compile: ngCompile,
    destroy: ngDestroy
  };

})();
