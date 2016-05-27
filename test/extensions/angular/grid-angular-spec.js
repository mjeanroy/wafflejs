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

describe('Waffle Angular Directive', () => {

  let $rootScope;
  let $compile;
  let $scope;

  let options;
  let compileTable;

  beforeEach(inject((_$rootScope_, _$compile_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $scope = $rootScope.$new();

    options = {
      data: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
        { id: 3, name: 'foobar' }
      ],
      columns: [
        { id: 'id', title: 'Id' },
        { id: 'name', title: 'Name' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    };

    compileTable = (table, $scope) => {
      const $table = $compile(table)($scope);
      $scope.$digest();
      return $table;
    };
  }));

  it('should build table using directive with immutable option', () => {
    $scope.options = options;
    const table = '<table waffle waffle-options="options"></table>';
    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();

    const childNodes = $table[0].childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[0]).toBeDOMElement('thead');
    expect(childNodes[1]).toBeDOMElement('tbody');
    expect(childNodes[2]).toBeDOMElement('tfoot');

    const thead = childNodes[0];
    const tbody = childNodes[1];
    const tfoot = childNodes[2];

    expect(thead.childNodes[0].childNodes.length).toBe(3);
    expect(tfoot.childNodes[0].childNodes.length).toBe(3);

    const dataHeader = Array.prototype.slice(thead.childNodes[0].childNodes, 1);
    expect(dataHeader).toVerify((node, idx) => node.innerHTML === $scope.options.columns[idx].title);

    const dataFooter = Array.prototype.slice(tfoot.childNodes[0].childNodes, 1);
    expect(dataFooter).toVerify((node, idx) => node.innerHTML === $scope.options.columns[idx].title);

    expect(tbody.childNodes.length).toBe(3);
    expect(tbody.childNodes).toVerify((node, idx) => {
      const tds = node.childNodes;
      const data = $scope.options.data[idx];
      return tds[1].innerHTML === data.id.toString() &&
             tds[2].innerHTML === data.name.toString();
    });
  });

  it('should build table using directive with immutable option and set grid object', () => {
    $scope.options = options;
    const table = '<table waffle waffle-options="options" waffle-grid="grid"></table>';
    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();

    const childNodes = $table[0].childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[0]).toBeDOMElement('thead');
    expect(childNodes[1]).toBeDOMElement('tbody');
    expect(childNodes[2]).toBeDOMElement('tfoot');

    const thead = childNodes[0];
    const tbody = childNodes[1];
    const tfoot = childNodes[2];

    expect(thead.childNodes[0].childNodes.length).toBe(3);
    expect(tfoot.childNodes[0].childNodes.length).toBe(3);

    const dataHeader = Array.prototype.slice(thead.childNodes[0].childNodes, 1);
    expect(dataHeader).toVerify((node, idx) => node.innerHTML === $scope.options.columns[idx].title);

    const dataFooter = Array.prototype.slice(tfoot.childNodes[0].childNodes, 1);
    expect(dataFooter).toVerify((node, idx) => node.innerHTML === $scope.options.columns[idx].title);

    expect(tbody.childNodes.length).toBe(3);
    expect(tbody.childNodes).toVerify((node, idx) => {
      const tds = node.childNodes;
      const data = $scope.options.data[idx];
      return tds[1].innerHTML === data.id.toString() &&
             tds[2].innerHTML === data.name.toString();
    });

    expect($scope.grid).toBeDefined();
    expect($scope.grid.$data.toArray()).toEqual(options.data);
  });

  it('should build table using directive with grid options', () => {
    $scope.grid = options;
    const table = '<table waffle waffle-grid="grid"></table>';
    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();

    const childNodes = $table[0].childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[0]).toBeDOMElement('thead');
    expect(childNodes[1]).toBeDOMElement('tbody');
    expect(childNodes[2]).toBeDOMElement('tfoot');

    const thead = childNodes[0];
    const tbody = childNodes[1];
    const tfoot = childNodes[2];

    expect(thead.childNodes[0].childNodes.length).toBe(3);
    expect(tfoot.childNodes[0].childNodes.length).toBe(3);

    const dataHeader = Array.prototype.slice(thead.childNodes[0].childNodes, 1);
    expect(dataHeader).toVerify((node, idx) => node.innerHTML === options.columns[idx].title);

    const dataFooter = Array.prototype.slice(tfoot.childNodes[0].childNodes, 1);
    expect(dataFooter).toVerify((node, idx) => node.innerHTML === options.columns[idx].title);

    expect(tbody.childNodes.length).toBe(3);
    expect(tbody.childNodes).toVerify((node, idx) => {
      const tds = node.childNodes;
      const data = options.data[idx];
      return tds[1].innerHTML === data.id.toString() &&
             tds[2].innerHTML === data.name.toString();
    });

    expect($scope.grid).toBeInstanceOf(Grid);
    expect($scope.grid.$data.toArray()).toEqual(options.data);
  });

  it('should build table using columns initialization', () => {
    $scope.columns = [
      { id: 'foo' },
      { id: 'bar' }
    ];

    const table = '<table waffle waffle-grid="grid" columns="columns"></table>';
    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();

    const childNodes = $table[0].childNodes;
    expect(childNodes.length).toBe(2);
    expect(childNodes[0]).toBeDOMElement('thead');
    expect(childNodes[1]).toBeDOMElement('tbody');

    const thead = childNodes[0];
    const tbody = childNodes[1];

    expect(thead.childNodes[0].childNodes.length).toBe(3);

    const dataHeader = Array.prototype.slice(thead.childNodes[0].childNodes, 1);
    expect(dataHeader).toVerify((node, idx) => node.innerHTML === options.columns[idx].title);
  });

  it('should trigger callbacks', () => {
    $scope.grid = options;

    $scope.onInitialized = jasmine.createSpy('onInitialized');
    $scope.onRendered = jasmine.createSpy('onRendered');
    $scope.onDataSpliced = jasmine.createSpy('onDataSpliced');

    const table =
      `<table waffle
              waffle-grid="grid"
              on-initialized="onInitialized()"
              on-rendered="onRendered()"
              on-data-spliced="onDataSpliced()"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.onInitialized).toHaveBeenCalled();
    expect($scope.onRendered).toHaveBeenCalled();
    expect($scope.onDataSpliced).not.toHaveBeenCalled();

    $scope.grid.data().push({
      id: 10,
      name: 'foo'
    });

    jasmine.clock().tick();

    expect($scope.onDataSpliced).toHaveBeenCalled();
  });

  it('should destroy grid when scope is destroyed', () => {
    const unwatcher = jasmine.createSpy('unwatcher');
    spyOn($scope, '$watch').and.returnValue(unwatcher);
    spyOn(Grid.prototype, 'destroy').and.callThrough();

    $scope.options = options;

    const table =
      `<table waffle
              waffle-options="options"
              waffle-filter="filter"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect(Grid.prototype.destroy).not.toHaveBeenCalled();
    expect(unwatcher).not.toHaveBeenCalled();

    $scope.$destroy();

    expect(Grid.prototype.destroy).toHaveBeenCalled();
    expect(unwatcher).toHaveBeenCalled();
  });

  it('should not override events if dom attribute is not defined', () => {
    $scope.grid = options;

    $scope.onInitialized = jasmine.createSpy('onInitialized');
    $scope.onRendered = jasmine.createSpy('onRendered');
    $scope.onDataSpliced = jasmine.createSpy('onDataSpliced');

    const table =
      `<table waffle
              waffle-grid="grid"
              on-initialized="onInitialized()"
              on-rendered="onRendered()"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid.options.events.onDataSpliced).toBeNull();
    expect($scope.grid.options.events.onRendered).not.toBe(_.noop);
  });

  it('should bind selection to ng-model attribute', () => {
    $scope.grid = angular.extend(options, {
      selection: {
        enable: true
      }
    });

    $scope.selection = [];

    const table =
      `<table waffle
              waffle-grid="grid"
              ng-model="selection"
              on-initialized="onInitialized()"
              on-rendered="onRendered()"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.selection).toBeDefined();

    const d1 = $scope.grid.data().at(0);

    $scope.grid.selection().push(d1);

    jasmine.clock().tick();
    $rootScope.$digest();

    expect($scope.selection.length).toBe(1);
    expect($scope.selection[0]).toBe(d1);
  });

  it('should disable selection', () => {
    const columns = options.columns;

    // Set options on scope
    $scope.options = options;

    const table =
      `<table waffle
              waffle-options="options"
              waffle-grid="grid"
              waffle-selection="false"
              on-initialized="onInitialized()"
              on-rendered="onRendered()"></table>`;

    const $table = compileTable(table, $scope);

    // Trigger a digest
    $rootScope.$digest();

    // Selection column should not be here
    const thead = $scope.grid.$thead[0];
    expect(thead.childNodes[0].childNodes.length).toBe(columns.length);
  });

  it('should update selection with ngModel value', () => {
    $scope.grid = angular.extend(options, {
      selection: {
        enable: true
      }
    });

    $scope.selection = [];

    const table =
      `<table waffle
              waffle-grid="grid"
              ng-model="selection"
              on-initialized="onInitialized()"
              on-rendered="onRendered()"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.selection).toBeDefined();

    const d1 = $scope.grid.data().at(0);

    $scope.selection = [d1];

    $rootScope.$digest();
    jasmine.clock().tick();

    expect($scope.grid.selection().length).toBe(1);
    expect($scope.grid.selection()[0]).toBe(d1);
  });

  it('should update filter using binding', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              waffle-filter="filter"></table>`;

    const $table = compileTable(table, $scope);
    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();
    expect($scope.grid.filter).toHaveBeenCalledWith(undefined);

    $scope.grid.filter.calls.reset();

    $scope.$apply(() => {
      $scope.filter = 'foo';
    });

    expect($scope.grid.filter).toHaveBeenCalledWith('foo');
  });

  it('should update filter using attribute simple name', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              filter="filter"></table>`;

    const $table = compileTable(table, $scope);
    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();
    expect($scope.grid.filter).toHaveBeenCalledWith(undefined);
    expect($scope.grid.filter.calls.count()).toBe(1);

    $scope.grid.filter.calls.reset();

    $scope.$apply(() => {
      $scope.filter = 'foo';
    });

    expect($scope.grid.filter).toHaveBeenCalledWith('foo');
  });

  it('should update filter using attribute interpolation', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              waffle-filter="{{ filter }}"></table>`;

    const $table = compileTable(table, $scope);
    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();
    expect($scope.grid.filter).toHaveBeenCalledWith('');
    expect($scope.grid.filter.calls.count()).toBe(1);

    $scope.grid.filter.calls.reset();

    $scope.$apply(() => {
      $scope.filter = 'foo';
    });

    expect($scope.grid.filter).toHaveBeenCalledWith('foo');
  });

  it('should update filter when directive is initialized with constant value', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              waffle-filter="'foo'"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();
    expect($scope.grid.filter).toHaveBeenCalledWith('foo');
    expect($scope.grid.filter.calls.count()).toBe(1);
  });

  it('should update filter when directive is initialized with attribute interpolated', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              waffle-filter="{{ filter }}"></table>`;

    $scope.filter = 'foo';

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();
    expect($scope.grid.filter).toHaveBeenCalledWith('foo');
    expect($scope.grid.filter.calls.count()).toBe(1);
  });

  it('should update filter when directive is initialized with attribute interpolated and constant variable', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              waffle-filter="hello {{ filter }}"></table>`;

    $scope.filter = 'foo';

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();
    expect($scope.grid.filter).toHaveBeenCalledWith('hello foo');
    expect($scope.grid.filter.calls.count()).toBe(1);
  });

  it('should update filter using an object', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              waffle-filter="{ foo: filter }"></table>`;

    $scope.filter = 'foo';

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();

    expect($scope.grid.filter).toHaveBeenCalledWith({
      foo: 'foo'
    });

    expect($scope.grid.filter.calls.count()).toBe(1);
  });

  it('should update filter using a new object', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              waffle-filter="{ foo: filter }"></table>`;

    $scope.filter = 'foo';

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();

    expect($scope.grid.filter.calls.count()).toBe(1);
    expect($scope.grid.filter).toHaveBeenCalledWith({
      foo: 'foo'
    });

    $scope.grid.filter.calls.reset();

    $scope.$apply(() => {
      $scope.filter = 'bar';
    });

    expect($scope.grid.filter.calls.count()).toBe(1);
    expect($scope.grid.filter).toHaveBeenCalledWith({
      foo: 'bar'
    });
  });

  it('should update filter using an object in scope', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              waffle-filter="filter"></table>`;

    $scope.filter = {
      foo: 'foo'
    };

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();

    expect($scope.grid.filter.calls.count()).toBe(1);
    expect($scope.grid.filter).toHaveBeenCalledWith({
      foo: 'foo'
    });

    $scope.grid.filter.calls.reset();

    $scope.$apply(() => {
      $scope.filter.foo = 'bar';
    });

    expect($scope.grid.filter.calls.count()).toBe(1);
    expect($scope.grid.filter).toHaveBeenCalledWith({
      foo: 'bar'
    });
  });

  it('should update filter using a static object', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              waffle-grid="grid"
              waffle-filter="{ foo: 'foo' }"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();

    expect($scope.grid.filter).toHaveBeenCalledWith({
      foo: 'foo'
    });

    expect($scope.grid.filter.calls.count()).toBe(1);
  });

  it('should use filter even if datagrid is not selectable', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              data-waffle-grid="grid"
              data-waffle-selection="{ enable: false }"
              data-waffle-filter="{ foo: 'foo' }"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();

    expect($scope.grid.filter).toHaveBeenCalledWith({
      foo: 'foo'
    });

    expect($scope.grid.filter.calls.count()).toBe(1);
  });

  it('should not use ng compilation by default', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              data-waffle-grid="grid"
              data-waffle-selection="{ enable: false }"
              data-waffle-filter="{ foo: 'foo' }"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();
    expect($scope.grid.options.ng).toBeUndefined();
  });

  it('should use ng compilation', () => {
    spyOn(Grid.prototype, 'filter').and.callThrough();

    const table =
      `<table waffle
              data-waffle-grid="grid"
              data-waffle-ng-compile="true"
              data-waffle-selection="{ enable: false }"
              data-waffle-filter="{ foo: 'foo' }"></table>`;

    const $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid).toBeDefined();
    expect($scope.grid.options.ng).toEqual({
      $scope: $scope
    });
  });
});
