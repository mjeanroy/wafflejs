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

describe('Grid Render', () => {

  it('should render column header', () => {
    const columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo' }
    ];

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: columns,
      view: {
        thead: true,
        tfoot: true
      }
    });

    const tbody = grid.$tbody[0];
    expect(tbody.childNodes).toHaveLength(0);

    const thead = grid.$thead[0];
    const tr = thead.childNodes;
    expect(tr).toHaveLength(1);
    expect(tr[0]).toBeDOMElement('tr');

    const ths = tr[0].childNodes;

    // 2 columns + 1 column for checkbox
    expect(ths).toHaveLength(3);
    expect(ths).toVerify(node => node.tagName === 'TH');

    const dataColumns = Array.prototype.slice.call(ths, 1);

    expect(dataColumns).toVerify((node, idx) => node.innerHTML === columns[idx].title);
    expect(dataColumns).toVerify((node, idx) => {
      const cssClasses = [
        columns[idx].id,
        'waffle-sortable'
      ];

      return node.className === cssClasses.join(' ');
    });

    expect(dataColumns).toVerify((node, idx) => node.getAttribute('data-waffle-id') === columns[idx].id);
    expect(dataColumns).toVerify((node, idx) => node.getAttribute('data-waffle-order') === null);
    expect(dataColumns).toVerify(node => node.getAttribute('data-waffle-sortable') === 'true');
  });

  it('should not render header', () => {
    const columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo' }
    ];

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: columns,
      view: {
        thead: false,
        tfoot: true
      }
    });

    expect(grid.$thead).not.toBeDefined();

    const nodes = table.getElementsByTagName('thead');
    expect(nodes.length).toBe(0);
  });

  it('should not render footer', () => {
    const columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo' }
    ];

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: columns,
      view: {
        thead: true,
        tfoot: false
      }
    });

    expect(grid.$tfoot).not.toBeDefined();

    const nodes = table.getElementsByTagName('tfoot');
    expect(nodes.length).toBe(0);
  });

  it('should render column header with unsortable column', () => {
    const columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo', sortable: false }
    ];

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: columns,
      view: {
        thead: true,
        tfoot: true
      }
    });

    const tbody = grid.$tbody[0];
    expect(tbody.childNodes).toHaveLength(0);

    const thead = grid.$thead[0];
    const tr = thead.childNodes;
    expect(tr).toHaveLength(1);
    expect(tr[0]).toBeDOMElement('tr');

    const ths = tr[0].childNodes;

    // 2 columns + 1 column for checkbox
    expect(ths).toHaveLength(3);

    const dataColumns = Array.prototype.slice.call(ths, 1);

    expect(dataColumns).toVerify(node => node.tagName === 'TH');
    expect(dataColumns).toVerify((node, idx) => node.innerHTML === columns[idx].title);

    expect(dataColumns[0].className.split(' ')).toContain('waffle-sortable');
    expect(dataColumns[1].className.split(' ')).not.toContain('waffle-sortable');

    expect(dataColumns[0].getAttribute('data-waffle-sortable')).toBe('true');
    expect(dataColumns[1].getAttribute('data-waffle-sortable')).toBeNull();
  });

  it('should render column footer', () => {
    const columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo' }
    ];

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: columns,
      view: {
        thead: true,
        tfoot: true
      }
    });

    const tbody = grid.$tbody[0];
    expect(tbody.childNodes).toHaveLength(0);

    const tfoot = grid.$tfoot[0];
    const tr = tfoot.childNodes;
    expect(tr).toHaveLength(1);
    expect(tr[0]).toBeDOMElement('tr');

    const ths = tr[0].childNodes;

    // 2 columns + 1 column for checkbox
    expect(ths).toHaveLength(3);
    expect(ths).toVerify(node => node.tagName === 'TH');

    const dataColumns = Array.prototype.slice.call(ths, 1);

    expect(dataColumns).toVerify((node, idx) => node.innerHTML === columns[idx].title);
    expect(dataColumns).toVerify((node, idx) => {
      const cssClasses = [
        columns[idx].id,
        'waffle-sortable'
      ];

      return node.className === cssClasses.join(' ');
    });

    expect(dataColumns).toVerify((node, idx) => node.getAttribute('data-waffle-id') === columns[idx].id);
    expect(dataColumns).toVerify((node, idx) => node.getAttribute('data-waffle-order') === null);
    expect(dataColumns).toVerify(node => node.getAttribute('data-waffle-sortable') === 'true');
  });

  it('should render column footer with unsortable column', () => {
    const columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo', sortable: false }
    ];

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: columns,
      view: {
        thead: true,
        tfoot: true
      }
    });

    const tbody = grid.$tbody[0];
    expect(tbody.childNodes).toHaveLength(0);

    const tfoot = grid.$tfoot[0];
    const tr = tfoot.childNodes;
    expect(tr).toHaveLength(1);
    expect(tr[0]).toBeDOMElement('tr');

    const ths = tr[0].childNodes;

    // 2 columns + 1 column for checkbox
    expect(ths).toHaveLength(3);

    const dataColumns = Array.prototype.slice.call(ths, 1);

    expect(dataColumns).toVerify(node => node.tagName === 'TH');
    expect(dataColumns).toVerify((node, idx) => node.innerHTML === columns[idx].title);

    expect(dataColumns[0].className.split(' ')).toContain('waffle-sortable');
    expect(dataColumns[1].className.split(' ')).not.toContain('waffle-sortable');

    expect(dataColumns[0].getAttribute('data-waffle-sortable')).toBe('true');
    expect(dataColumns[1].getAttribute('data-waffle-sortable')).toBeNull();
  });

  it('should render data', () => {
    const columns = [
      { id: 'id', title: 'Foo' },
      { id: 'name', title: 'Boo' }
    ];

    const data = [
      { id: 1, name: 'foo1 '},
      { id: 2, name: 'foo2 '},
      { id: 3, name: 'foo3 '}
    ];

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: data,
      columns: columns
    });

    const $tbody = grid.$tbody;
    const trs = $tbody[0].childNodes;
    expect(trs.length).toBe(data.length);

    // 2 columns + 1 column for checkbox
    expect(trs).toVerify(node => node.tagName === 'TR');
    expect(trs).toVerify(node => node.childNodes.length === 3);
    expect(trs).toVerify((node, idx) => node.getAttribute('data-waffle-idx') === idx.toString());
    expect(trs).toVerify((node, idx) => {
      const tds = node.childNodes;
      return tds[1].innerHTML === data[idx].id.toString() &&
             tds[2].innerHTML === data[idx].name.toString();
    });

    expect(trs).toVerify(node => {
      const css1 = [columns[0].id, 'waffle-sortable'];
      const css2 = [columns[1].id, 'waffle-sortable'];
      const tds = node.childNodes;
      return tds[1].className === css1.join(' ') &&
             tds[2].className === css2.join(' ');
    });

    expect(trs).toVerify((node, idx) => {
      const tds = node.childNodes;
      return tds[1].getAttribute('data-waffle-id') === columns[0].id &&
             tds[2].getAttribute('data-waffle-id') === columns[1].id;
    });

    // Each row should have a unique cid
    expect(trs).toVerify(node => node.getAttribute('data-waffle-cid') !== null);

    const cids = [];
    for (let i = 0; i < trs.length; i++) {
      cids.push(trs[i].getAttribute('data-waffle-cid'));
    }

    expect(cids).toContainsDistinctValues();
  });

  it('should render data asynchronously', () => {
    const columns = [
      { id: 'id', title: 'Foo' },
      { id: 'name', title: 'Boo' }
    ];

    const data = [];
    for (let i = 0; i < 215; ++i) {
      data.push({
        id: i + 1,
        name: 'foo' + (i + 1)
      });
    }

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: data,
      columns: columns
    });

    expect(grid.$tbody[0].childNodes.length).toBe(data.length);

    const result = grid.renderBody(true);

    expect(result).toBe(grid);

    // Grid should not be empty until first chunks has been appended
    expect(grid.$tbody[0].childNodes.length).toBe(215);

    // Trigger first timeout
    jasmine.clock().tick();
    expect(grid.$tbody[0].childNodes.length).toBe(200);

    // Trigger second timeout
    jasmine.clock().tick(10);
    expect(grid.$tbody[0].childNodes.length).toBe(215);

    const trs = grid.$tbody[0].childNodes;
    expect(trs).toVerify((node, idx) => node.getAttribute('data-waffle-idx') === idx.toString());
  });
});
