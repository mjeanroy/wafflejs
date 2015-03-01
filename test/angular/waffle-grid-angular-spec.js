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

  beforeEach(angular.mock.module('waffle'));

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

  it('should build table from using directive', function() {
    $scope.options = options;
    var table = '<table waffle waffle-options="options"></table>';
    var $table = compileTable(table, $scope);

    expect($table).toBeDefined();

    var childNodes = $table[0].childNodes;
    expect(childNodes.length).toBe(2);
    expect(childNodes[0]).toBeDOMElement('thead');
    expect(childNodes[1]).toBeDOMElement('tbody');

    var thead = childNodes[0];
    var ths = thead.childNodes[0].childNodes;
    expect(ths.length).toBe(2);
    expect(ths).toVerify(function(node, idx) {
      return node.innerHTML === $scope.options.columns[idx].title;
    });

    var tbody = childNodes[1];
    var trs = tbody.childNodes;
    expect(trs.length).toBe(3);
    expect(trs).toVerify(function(node, idx) {
      var tds = node.childNodes;
      var data = $scope.options.data[idx];
      return tds[0].innerHTML === data.id.toString() &&
             tds[1].innerHTML === data.name.toString();
    });
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
});
