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

describe('waffle-jq-angular', function() {

  var $rootScope;
  var $compile;
  var $scope;

  var options;
  var compileTable;

  beforeEach(inject(function(_$rootScope_, _$compile_) {
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
      ]
    };

    compileTable = function(table, $scope) {
      var $table = $compile(table)($scope);
      $scope.$digest();
      return $table;
    };
  }));

  it('should build table using directive with immutable option', function() {
    $scope.options = options;
    var table = '<table waffle waffle-options="options"></table>';
    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();

    var childNodes = $table[0].childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[0]).toBeDOMElement('thead');
    expect(childNodes[1]).toBeDOMElement('tbody');
    expect(childNodes[2]).toBeDOMElement('tfoot');

    var thead = childNodes[0];
    var tbody = childNodes[1];
    var tfoot = childNodes[2];

    expect(thead.childNodes[0].childNodes.length).toBe(3);
    expect(tfoot.childNodes[0].childNodes.length).toBe(3);

    var dataHeader = Array.prototype.slice(thead.childNodes[0].childNodes, 1);
    expect(dataHeader).toVerify(function(node, idx) {
      return node.innerHTML === $scope.options.columns[idx].title;
    });

    var dataFooter = Array.prototype.slice(tfoot.childNodes[0].childNodes, 1);
    expect(dataFooter).toVerify(function(node, idx) {
      return node.innerHTML === $scope.options.columns[idx].title;
    });

    expect(tbody.childNodes.length).toBe(3);
    expect(tbody.childNodes).toVerify(function(node, idx) {
      var tds = node.childNodes;
      var data = $scope.options.data[idx];
      return tds[1].innerHTML === data.id.toString() &&
             tds[2].innerHTML === data.name.toString();
    });
  });

  it('should build table using directive with immutable option and set grid object', function() {
    $scope.options = options;
    var table = '<table waffle waffle-options="options" waffle-grid="grid"></table>';
    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();

    var childNodes = $table[0].childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[0]).toBeDOMElement('thead');
    expect(childNodes[1]).toBeDOMElement('tbody');
    expect(childNodes[2]).toBeDOMElement('tfoot');

    var thead = childNodes[0];
    var tbody = childNodes[1];
    var tfoot = childNodes[2];

    expect(thead.childNodes[0].childNodes.length).toBe(3);
    expect(tfoot.childNodes[0].childNodes.length).toBe(3);

    var dataHeader = Array.prototype.slice(thead.childNodes[0].childNodes, 1);
    expect(dataHeader).toVerify(function(node, idx) {
      return node.innerHTML === $scope.options.columns[idx].title;
    });

    var dataFooter = Array.prototype.slice(tfoot.childNodes[0].childNodes, 1);
    expect(dataFooter).toVerify(function(node, idx) {
      return node.innerHTML === $scope.options.columns[idx].title;
    });

    expect(tbody.childNodes.length).toBe(3);
    expect(tbody.childNodes).toVerify(function(node, idx) {
      var tds = node.childNodes;
      var data = $scope.options.data[idx];
      return tds[1].innerHTML === data.id.toString() &&
             tds[2].innerHTML === data.name.toString();
    });

    expect($scope.grid).toBeDefined();
    expect($scope.grid.$data.toArray()).toEqual(options.data);
  });

  it('should build table using directive with grid options', function() {
    $scope.grid = options;
    var table = '<table waffle waffle-grid="grid"></table>';
    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();

    var childNodes = $table[0].childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[0]).toBeDOMElement('thead');
    expect(childNodes[1]).toBeDOMElement('tbody');
    expect(childNodes[2]).toBeDOMElement('tfoot');

    var thead = childNodes[0];
    var tbody = childNodes[1];
    var tfoot = childNodes[2];

    expect(thead.childNodes[0].childNodes.length).toBe(3);
    expect(tfoot.childNodes[0].childNodes.length).toBe(3);

    var dataHeader = Array.prototype.slice(thead.childNodes[0].childNodes, 1);
    expect(dataHeader).toVerify(function(node, idx) {
      return node.innerHTML === options.columns[idx].title;
    });

    var dataFooter = Array.prototype.slice(tfoot.childNodes[0].childNodes, 1);
    expect(dataFooter).toVerify(function(node, idx) {
      return node.innerHTML === options.columns[idx].title;
    });

    expect(tbody.childNodes.length).toBe(3);
    expect(tbody.childNodes).toVerify(function(node, idx) {
      var tds = node.childNodes;
      var data = options.data[idx];
      return tds[1].innerHTML === data.id.toString() &&
             tds[2].innerHTML === data.name.toString();
    });

    expect($scope.grid).toBeInstanceOf(Grid);
    expect($scope.grid.$data.toArray()).toEqual(options.data);
  });

  fit('should build table using columns initialization', function() {
    $scope.columns = [
      { id: 'foo' },
      { id: 'bar' }
    ];

    var table = '<table waffle waffle-grid="grid" columns="columns"></table>';
    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();

    var childNodes = $table[0].childNodes;
    expect(childNodes.length).toBe(3);
    expect(childNodes[0]).toBeDOMElement('thead');
    expect(childNodes[1]).toBeDOMElement('tbody');
    expect(childNodes[2]).toBeDOMElement('tfoot');

    var thead = childNodes[0];
    var tbody = childNodes[1];
    var tfoot = childNodes[2];

    expect(thead.childNodes[0].childNodes.length).toBe(3);
    expect(tfoot.childNodes[0].childNodes.length).toBe(3);

    var dataHeader = Array.prototype.slice(thead.childNodes[0].childNodes, 1);
    expect(dataHeader).toVerify(function(node, idx) {
      return node.innerHTML === options.columns[idx].title;
    });

    var dataFooter = Array.prototype.slice(tfoot.childNodes[0].childNodes, 1);
    expect(dataFooter).toVerify(function(node, idx) {
      return node.innerHTML === options.columns[idx].title;
    });
  });

  it('should trigger callbacks', function() {
    $scope.grid = options;

    $scope.onInitialized = jasmine.createSpy('onInitialized');
    $scope.onRendered = jasmine.createSpy('onRendered');
    $scope.onDataSpliced = jasmine.createSpy('onDataSpliced');

    var table = '' +
      '<table waffle waffle-grid="grid" ' +
      '       on-initialized="onInitialized()" ' +
      '       on-rendered="onRendered()" ' +
      '       on-data-spliced="onDataSpliced()" ' +
      '></table>';

    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.onInitialized).toHaveBeenCalled();
    expect($scope.onRendered).toHaveBeenCalled();
    expect($scope.onDataSpliced).not.toHaveBeenCalled();

    $scope.grid.data().push([
      { id: 10, name: 'foo' }
    ]);

    jasmine.clock().tick();

    expect($scope.onDataSpliced).toHaveBeenCalled();
  });

  it('should destroy grid when scope is destroyed', function() {
    spyOn(Grid.prototype, 'destroy').and.callThrough();

    $scope.options = options;
    var table = '<table waffle waffle-options="options"></table>';
    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect(Grid.prototype.destroy).not.toHaveBeenCalled();

    $scope.$destroy();
    expect(Grid.prototype.destroy).toHaveBeenCalled();
  });

  it('should not override events if dom attribute is not defined', function() {
    $scope.grid = options;

    $scope.onInitialized = jasmine.createSpy('onInitialized');
    $scope.onRendered = jasmine.createSpy('onRendered');
    $scope.onDataSpliced = jasmine.createSpy('onDataSpliced');

    var table = '' +
      '<table waffle waffle-grid="grid" ' +
      '       on-initialized="onInitialized()" ' +
      '       on-rendered="onRendered()" ' +
      '></table>';

    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.grid.options.events.onDataSpliced).toBeNull();
    expect($scope.grid.options.events.onRendered).not.toBe(_.noop);
  });

  it('should bind selection to ng-model attribute', function() {
    $scope.grid = angular.extend(options, {
      selection: {
        enable: true
      }
    });

    $scope.selection = [];

    var table = '' +
      '<table waffle waffle-grid="grid" ' +
      '       ng-model="selection" ' +
      '       on-initialized="onInitialized()" ' +
      '       on-rendered="onRendered()" ' +
      '></table>';

    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.selection).toBeDefined();

    var d1 = $scope.grid.data().at(0);

    $scope.grid.selection().push(d1);

    jasmine.clock().tick();
    $rootScope.$digest();

    expect($scope.selection.length).toBe(1);
    expect($scope.selection[0]).toBe(d1);
  });

  it('should update selection with ngModel value', function() {
    $scope.grid = angular.extend(options, {
      selection: {
        enable: true
      }
    });

    $scope.selection = [];

    var table = '' +
      '<table waffle waffle-grid="grid" ' +
      '       ng-model="selection" ' +
      '       on-initialized="onInitialized()" ' +
      '       on-rendered="onRendered()" ' +
      '></table>';

    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();
    expect($scope.selection).toBeDefined();

    var d1 = $scope.grid.data().at(0);

    $scope.selection = [d1];

    $rootScope.$digest();
    jasmine.clock().tick();

    expect($scope.grid.selection().length).toBe(1);
    expect($scope.grid.selection()[0]).toBe(d1);
  });
});
