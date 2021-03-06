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

describe('Waffle NgCompilator', () => {

  let $rootScope;
  let $compile;

  beforeEach(inject((_$rootScope_, _$compile_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  it('should compile a row', () => {
    const index = 0;
    const data = {
      id: 1,
      name: 'foo'
    };

    const parentScope = $rootScope.$new();

    const tr = document.createElement('tr');
    tr.setAttribute('data-waffle-cid', 1);

    spyOn(parentScope, '$new').and.callThrough();

    const result = NgCompilator.compile(parentScope, tr, data, index);

    expect(result).toBeDefined();
    expect(result).toBe(tr);
    expect(parentScope.$new).toHaveBeenCalled();

    const $scope = angular.element(tr).scope();
    expect($scope).toBeDefined();
    expect($scope.$parent).toBe(parentScope);
    expect($scope.$data).toBe(data);
    expect($scope.$index).toBe(index);
  });

  it('should compile a row and destroy old scope', () => {
    const index = 0;
    const data = {
      id: 1,
      name: 'foo'
    };

    const parentScope = $rootScope.$new();

    const tr = document.createElement('tr');
    tr.setAttribute('data-waffle-cid', 1);

    spyOn(parentScope, '$new').and.callThrough();

    const r1 = NgCompilator.compile(parentScope, tr, data, index);

    expect(r1).toBeDefined();
    expect(r1).toBe(tr);
    expect(parentScope.$new).toHaveBeenCalled();

    const $scope1 = angular.element(tr).scope();
    expect($scope1).toBeDefined();
    expect($scope1.$parent).toBe(parentScope);
    expect($scope1.$data).toBe(data);
    expect($scope1.$index).toBe(index);

    const destroy = spyOn($scope1, '$destroy').and.callThrough();

    const r2 = NgCompilator.compile(parentScope, tr, data, index);

    expect(r2).toBeDefined();
    expect(r2).toBe(r1);
    expect(destroy).toHaveBeenCalled();

    const $scope2 = angular.element(r2).scope();
    expect($scope2).toBeDefined();
    expect($scope2.$parent).toBe(parentScope);
    expect($scope2).not.toBe($scope1);
    expect($scope2.$data).toBe(data);
    expect($scope2.$index).toBe(index);
  });

  it('should destroy scope using row', () => {
    const index = 0;
    const data = {
      id: 1,
      name: 'foo'
    };

    const parentScope = $rootScope.$new();

    const tr = document.createElement('tr');
    tr.setAttribute('data-waffle-cid', 1);

    spyOn(parentScope, '$new').and.callThrough();

    const r1 = NgCompilator.compile(parentScope, tr, data, index);
    const $scope1 = angular.element(r1).scope();
    expect($scope1.$$destroyed).toBeDefined();
    expect($scope1.$$destroyed).toBeFalse();

    NgCompilator.destroy(r1);

    const $scope2 = angular.element(r1).scope();
    expect($scope2).toBeDefined();
    expect($scope2.$$destroyed).toBeTrue();
  });

  it('should destroy scope using cid', () => {
    const index = 0;
    const data = {
      id: 1,
      name: 'foo'
    };

    const parentScope = $rootScope.$new();

    const tr = document.createElement('tr');
    tr.setAttribute('data-waffle-cid', 1);

    spyOn(parentScope, '$new').and.callThrough();

    const r1 = NgCompilator.compile(parentScope, tr, data, index);
    const $scope1 = angular.element(r1).scope();
    expect($scope1.$$destroyed).toBeDefined();
    expect($scope1.$$destroyed).toBeFalse();

    NgCompilator.destroy(1);

    const $scope2 = angular.element(r1).scope();
    expect($scope2).toBeDefined();
    expect($scope2.$$destroyed).toBeTrue();
  });

  it('should refresh scope', () => {
    const index = 0;
    const data = {
      id: 1,
      name: 'foo'
    };

    const parentScope = $rootScope.$new();

    const tr = document.createElement('tr');
    tr.setAttribute('data-waffle-cid', 1);

    const r1 = NgCompilator.compile(parentScope, tr, data, index);
    expect(r1).toBeDefined();
    expect(r1).toBe(tr);

    const $scope1 = angular.element(r1).scope();
    expect($scope1).toBeDefined();
    expect($scope1.$$destroyed).toBeFalse();

    const r2 = NgCompilator.refresh(tr);
    expect(r2).toBeDefined();
    expect(r2).toBe(r1);

    const $scope2 = angular.element(r2).scope();
    expect($scope2).toBeDefined();
    expect($scope2).not.toBe($scope1);
    expect($scope2.$$destroyed).toBeFalse();
    expect($scope1.$$destroyed).toBeTrue();
  });

  describe('once initialized', () => {
    let $scope;
    let $table;
    let table;

    // Set of utility function
    let getRows;
    let getChildScopes;
    let spyDestroyFn;

    beforeEach(() => {
      $scope = $rootScope.$new();

      const data = [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
        { id: 3, name: 'foobar' }
      ];

      const columnActions = {
        id: 'actions',
        title: 'Actions',
        escape: false,
        renderer: [() => {
          return '<button ng-click="foo($data, $index)"></button>';
        }]
      };

      const columns = [
        { id: 'id', title: 'Id' },
        { id: 'name', title: 'Name' },
        columnActions
      ];

      $scope.foo = jasmine.createSpy('foo');
      $scope.options = {
        data: data,
        columns: columns,
        view: {
          thead: true,
          tfoot: true
        }
      };

      const html =
        `<table waffle
                data-waffle-options="options"
                data-waffle-grid="grid"
                data-waffle-ng-compile="true"></table>`;

      $table = $compile(html)($scope);
      table = $table[0];

      // Trigger a digest
      $scope.$digest();

      getRows = () => {
        const tbody = table.childNodes[1];
        const childNodes = tbody.childNodes;

        const results = [];

        for (let i = 0; i < childNodes.length; i++) {
          results.push(childNodes[i]);
        }

        return results;
      };

      getChildScopes = () => {
        const rows = getRows();
        const childScopes = [];

        for (let i = 0; i < rows.length; i++) {
          const scope = angular.element(rows[i]).scope();
          childScopes.push(scope);
        }

        return childScopes;
      };

      spyDestroyFn = scopes => {
        const spies = [];
        for (let i = 0; i < scopes.length; i++) {
          spies.push(spyOn(scopes[i], '$destroy').and.callThrough());
        }
        return spies;
      };
    });

    afterEach(() => $scope.$destroy());

    it('should handle child scopes when grid is initialized', () => {
      expect($scope.grid.options.ng).toEqual({
        $scope: $scope
      });

      const childNodes = $table[0].childNodes;
      const tbody = childNodes[1];
      const tr0 = tbody.childNodes[0];
      const button = tr0.childNodes[3].childNodes[0];
      const $button = angular.element(button);

      expect($scope.foo).not.toHaveBeenCalled();

      $button.triggerHandler('click');
      $scope.$digest();

      expect($scope.foo).toHaveBeenCalledWith($scope.grid.data().at(0), 0);
    });

    it('should destroy old scopes when grid is rendered', () => {
      const spies = spyDestroyFn(getChildScopes());

      // Render tbody
      $scope.grid.renderBody();

      expect(spies).toVerify(spy => spy.calls.count() === 1);
    });

    it('should destroy old scopes when data are removed', () => {
      spyOn(NgCompilator, 'destroy').and.callThrough();

      const rows = getRows();
      const lastRow = rows[rows.length - 1];
      const scope = angular.element(lastRow).scope();
      const spy = spyOn(scope, '$destroy').and.callThrough();

      // Remove last row
      $scope.grid.data().pop();

      expect(spy).not.toHaveBeenCalled();

      jasmine.clock().tick();

      expect(NgCompilator.destroy).toHaveBeenCalledWith(lastRow);
      expect(spy).toHaveBeenCalled();
    });

    it('should destroy old scopes when data are filtered', () => {
      spyOn(NgCompilator, 'destroy').and.callThrough();

      const oddPredicate = jasmine.createSpy('oddPredicate').and.callFake(o => o.id % 2 === 0);
      const destroyFns = spyDestroyFn(getChildScopes());

      $scope.grid.filter(oddPredicate);

      expect(destroyFns[0]).toHaveBeenCalled();
      expect(destroyFns[1]).not.toHaveBeenCalled();
      expect(destroyFns[2]).toHaveBeenCalled();
    });

    it('it should re-create scope when columns are added', () => {
      const spies = spyDestroyFn(getChildScopes());

      spyOn(NgCompilator, 'refresh').and.callThrough();

      $scope.grid.columns().splice(0, 0, {
        id: 'bar'
      });

      jasmine.clock().tick();

      expect(NgCompilator.refresh).toHaveBeenCalled();

      expect(spies).toVerify(spy => spy.calls.count() > 0);

      const newScopes = getChildScopes();
      expect(newScopes.length).toBe(3);
      expect(newScopes).toVerify(scope => !scope.$$destroyed);
    });

    it('it should destroy scope of temporary nodes', () => {
      const mergeNodes = $vdom.mergeNodes;

      let scope = null;
      spyOn($vdom, 'mergeNodes').and.callFake(function(parent, oldNode, tmpNode) {
        scope = angular.element(tmpNode).scope();
        return mergeNodes.apply(this, arguments);
      });

      $scope.grid.$data.notifyUpdate(0);
      jasmine.clock().tick();

      expect($vdom.mergeNodes).toHaveBeenCalled();
      expect(scope).not.toBeNull();
      expect(scope.$$destroyed).toBeTrue();
    });
  });
});
