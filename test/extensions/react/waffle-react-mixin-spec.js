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

describe('WaffleReactMixin', () => {

  let mixin;
  let table;

  beforeEach(() => {
    table = document.createElement('table');

    mixin = Object.create(WaffleReactMixin);
    mixin.props = Grid.options;

    spyOn(ReactDOM, 'findDOMNode').and.callFake(() => table);
    spyOn(Waffle, 'create').and.callThrough();
  });

  it('should have default props', () => {
    const props = mixin.getDefaultProps();
    expect(props).toBeDefined();
    expect(props).toEqual({
      waffle: jasmine.objectContaining(Grid.options)
    });
  });

  it('should attach grid when component will be mounted', () => {
    mixin.componentWillMount();

    expect(Waffle.create).toHaveBeenCalledWith(mixin.props.waffle);
    expect(mixin.grid).toBeDefined();
  });

  it('should attach grid when component is mounted', () => {
    mixin.grid = jasmine.createSpyObj('grid', ['attach']);
    mixin.componentDidMount();
    expect(mixin.grid.attach).toHaveBeenCalled();
  });

  it('should destroy grid when component is unmount', () => {
    mixin.grid = jasmine.createSpyObj('grid', ['destroy']);
    mixin.componentWillUnmount();
    expect(mixin.grid.destroy).toHaveBeenCalled();
  });

  it('should render grid when component is updated', () => {
    mixin.grid = jasmine.createSpyObj('grid', ['render']);
    mixin.componentDidUpdate();
    expect(mixin.grid.render).toHaveBeenCalled();
  });

  it('should disable update', () => {
    expect(mixin.shouldComponentUpdate()).toBe(false);
  });

  it('should get grid element', () => {
    mixin.grid = jasmine.createSpyObj('grid', ['render', 'destroy']);
    const grid = mixin.getGrid();
    expect(grid).toBe(mixin.grid);
  });
});
