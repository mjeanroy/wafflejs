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

describe('WaffleComponent', () => {

  const TestUtils = React.addons.TestUtils;

  beforeEach(() => {
    expect(TestUtils).toBeDefined();
    spyOn(React.DOM, 'table').and.callThrough();
  });

  it('should render component', () => {
    spyOn(Grid.prototype, 'visibleData').and.callThrough();

    const waffle = React.createElement(WaffleComponent, {
      view: {
        thead: true,
        tfoot: true
      }
    });

    const component = TestUtils.renderIntoDocument(waffle);
    const el = ReactDOM.findDOMNode(component);

    expect(el).toBeDefined();
    expect(el.tagName).toBe('TABLE');
    expect(component.grid).toBeDefined();
    expect(component.grid.visibleData).toHaveBeenCalled();

    const tbody = el.getElementsByTagName('tbody')[0];
    const thead = el.getElementsByTagName('thead')[0];
    const tfoot = el.getElementsByTagName('tfoot')[0];

    expect(tbody).not.toBeNull();
    expect(thead).not.toBeNull();
    expect(tfoot).not.toBeNull();
  });

  it('should render component to a string', () => {
    spyOn(Grid.prototype, 'visibleData').and.callThrough();

    const waffle = React.createElement(WaffleComponent, {
      view: {
        thead: true,
        tfoot: true
      }
    });

    const html = ReactDOMServer.renderToString(waffle);

    expect(html).toBeDefined();
    expect(html).toBeAString();
    expect(Grid.prototype.visibleData).toHaveBeenCalled();

    const node = document.createElement('div');
    node.innerHTML = html;

    const table = node.childNodes[0];
    expect(node).not.toBeNull();

    const tbody = table.getElementsByTagName('tbody')[0];
    const thead = table.getElementsByTagName('thead')[0];
    const tfoot = table.getElementsByTagName('tfoot')[0];

    expect(tbody).not.toBeNull();
    expect(thead).not.toBeNull();
    expect(tfoot).not.toBeNull();
  });
});
