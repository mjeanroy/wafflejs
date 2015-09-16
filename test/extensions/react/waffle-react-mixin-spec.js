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

describe('WaffleReactMixin', function() {

  var mixin;
  var table;

  beforeEach(function() {
    table = document.createElement('table');

    mixin = Object.create(WaffleReactMixin);
    mixin.props = Grid.options;
    mixin.getDOMNode = jasmine.createSpy('getDOMNode').and.callFake(function() {
      return table;
    });

    spyOn(Waffle, 'create').and.callThrough();
  });

  it('should have default props', function() {
    var props = mixin.getDefaultProps();
    expect(props).toBeDefined();
    expect(props).toEqual(jasmine.objectContaining(Grid.options));
    expect(props.className).toBe('table table-striped table-hover table-bordered');
  });

  it('should attach grid when component will be mounted', function() {
    mixin.componentWillMount();

    expect(Waffle.create).toHaveBeenCalledWith(mixin.props);
    expect(mixin.grid).toBeDefined();
  });

  it('should attach grid when component is mounted', function() {
    mixin.grid = jasmine.createSpyObj('grid', ['attach']);
    mixin.componentDidMount();
    expect(mixin.grid.attach).toHaveBeenCalled();
  });

  it('should destroy grid when component is unmount', function() {
    mixin.grid = jasmine.createSpyObj('grid', ['destroy']);
    mixin.componentWillUnmount();
    expect(mixin.grid.destroy).toHaveBeenCalled();
  });

  it('should render grid when component is updated', function() {
    mixin.grid = jasmine.createSpyObj('grid', ['render']);
    mixin.componentDidUpdate();
    expect(mixin.grid.render).toHaveBeenCalled();
  });

  it('should disable update', function() {
    expect(mixin.shouldComponentUpdate()).toBe(false);
  });

  it('should get grid element', function() {
    mixin.grid = jasmine.createSpyObj('grid', ['render', 'destroy']);
    var grid = mixin.getGrid();
    expect(grid).toBe(mixin.grid);
  });
});
