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

describe('Grid Sort', () => {

  let columns, data, table, grid;

  beforeEach(() => {
    columns = [
      { id: 'id', sortable: false },
      { id: 'firstName' },
      { id: 'lastName' }
    ];

    data = [
      { id: 2, firstName: 'foo2', lastName: 'bar2' },
      { id: 1, firstName: 'foo1', lastName: 'bar1' },
      { id: 3, firstName: 'foo2', lastName: 'bar3' }
    ];

    table = document.createElement('table');
    fixtures.appendChild(table);
  });

  it('should check if grid is sortable', () => {
    grid = new Grid(table, {
      data: data,
      columns: columns,
      view: {
        thead: true,
        tfoot: true
      }
    });

    grid.options.sortable = true;
    expect(grid.isSortable()).toBe(true);

    grid.options.sortable = false;
    expect(grid.isSortable()).toBe(false);
  });

  it('should sort grid by default using one field', () => {
    grid = new Grid(table, {
      data: data,
      columns: columns,
      sortBy: 'firstName',
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$comparators).toBeDefined();
    expect(grid.$comparators.length).toBe(1);
    expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
      id: 'firstName',
      asc: true
    }));

    const headers = grid.$thead[0].childNodes[0].childNodes;
    expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
    expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
    expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

    expect(headers[1].className).not.toContain('waffle-sortable');
    expect(headers[1].className).not.toContain('waffle-sortable-asc');
    expect(headers[1].className).not.toContain('waffle-sortable-desc');

    expect(headers[2].className).toContain('waffle-sortable');
    expect(headers[2].className).toContain('waffle-sortable-asc');
    expect(headers[2].className).not.toContain('waffle-sortable-desc');

    expect(headers[3].className).toContain('waffle-sortable');
    expect(headers[3].className).not.toContain('waffle-sortable-asc');
    expect(headers[3].className).not.toContain('waffle-sortable-desc');

    const footers = grid.$tfoot[0].childNodes[0].childNodes;
    expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
    expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
    expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

    expect(footers[1].className).not.toContain('waffle-sortable');
    expect(footers[1].className).not.toContain('waffle-sortable-asc');
    expect(footers[1].className).not.toContain('waffle-sortable-desc');

    expect(footers[2].className).toContain('waffle-sortable');
    expect(footers[2].className).toContain('waffle-sortable-asc');
    expect(footers[2].className).not.toContain('waffle-sortable-desc');

    expect(footers[3].className).toContain('waffle-sortable');
    expect(footers[3].className).not.toContain('waffle-sortable-asc');
    expect(footers[3].className).not.toContain('waffle-sortable-desc');

    expect(grid.$data.toArray()).toBeSorted((o1, o2) => o1.firstName.localeCompare(o2.firstName));
    expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === grid.$data[idx].id.toString());
  });

  it('should sort grid by default using two fields', () => {
    grid = new Grid(table, {
      data: data,
      columns: columns,
      sortBy: ['firstName', '-lastName'],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$comparators).toBeDefined();
    expect(grid.$comparators.length).toBe(2);

    expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
      id: 'firstName',
      asc: true
    }));

    expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
      id: 'lastName',
      asc: false
    }));

    const headers = grid.$thead[0].childNodes[0].childNodes;
    expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
    expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
    expect(headers[3].getAttribute('data-waffle-order')).toBe('-');

    expect(headers[1].className).not.toContain('waffle-sortable');
    expect(headers[1].className).not.toContain('waffle-sortable-asc');
    expect(headers[1].className).not.toContain('waffle-sortable-desc');

    expect(headers[2].className).toContain('waffle-sortable');
    expect(headers[2].className).toContain('waffle-sortable-asc');
    expect(headers[2].className).not.toContain('waffle-sortable-desc');

    expect(headers[3].className).toContain('waffle-sortable');
    expect(headers[3].className).not.toContain('waffle-sortable-asc');
    expect(headers[3].className).toContain('waffle-sortable-desc');

    const footers = grid.$tfoot[0].childNodes[0].childNodes;
    expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
    expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
    expect(footers[3].getAttribute('data-waffle-order')).toBe('-');

    expect(footers[1].className).not.toContain('waffle-sortable');
    expect(footers[1].className).not.toContain('waffle-sortable-asc');
    expect(footers[1].className).not.toContain('waffle-sortable-desc');

    expect(footers[2].className).toContain('waffle-sortable');
    expect(footers[2].className).toContain('waffle-sortable-asc');
    expect(footers[2].className).not.toContain('waffle-sortable-desc');

    expect(footers[3].className).toContain('waffle-sortable');
    expect(footers[3].className).not.toContain('waffle-sortable-asc');
    expect(footers[3].className).toContain('waffle-sortable-desc');

    expect(grid.$data.toArray()).toBeSorted((o1, o2) => (
      (o1.firstName.localeCompare(o2.firstName)) || (o1.lastName.localeCompare(o2.lastName)) * -1
    ));

    expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === grid.$data[idx].id.toString());
  });

  describe('once initialized with a footer and a header', () => {
    let headers;
    let footers;

    beforeEach(() => {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: true,
          tfoot: true
        }
      });

      headers = grid.$thead[0].childNodes[0].childNodes;
      footers = grid.$tfoot[0].childNodes[0].childNodes;
    });

    it('should not sort grid by default', () => {
      expect(grid.$comparators).toBeDefined();
      expect(grid.$comparators).toBeEmpty();

      expect(headers).toVerify(th => th.getAttribute('data-waffle-order') === null);
      expect(footers).toVerify(th => th.getAttribute('data-waffle-order') === null);

      // First th is for checkbox

      expect(headers[1].className.split(' ')).not.toContain('waffle-sortable');
      expect(headers[2].className.split(' ')).toContain('waffle-sortable');
      expect(headers[3].className.split(' ')).toContain('waffle-sortable');

      expect(footers[1].className.split(' ')).not.toContain('waffle-sortable');
      expect(footers[2].className.split(' ')).toContain('waffle-sortable');
      expect(footers[3].className.split(' ')).toContain('waffle-sortable');

      expect(headers).toVerify(th => th.className.split(' ').indexOf('waffle-sortable-asc') < 0);
      expect(footers).toVerify(th => th.className.split(' ').indexOf('waffle-sortable-asc') < 0);
      expect(headers).toVerify(th => th.className.split(' ').indexOf('waffle-sortable-desc') < 0);
      expect(footers).toVerify(th => th.className.split(' ').indexOf('waffle-sortable-desc') < 0);
      expect(grid.$data.toArray()).not.toBeSorted((o1, o2) => o1.id - o2.id);

      // First td is for checkbox
      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === data[idx].id.toString());
    });

    it('should sort grid in ascendant order using one field', () => {
      grid.sortBy('id');

      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'id',
        asc: true
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[2].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[1].className).toContain('waffle-sortable');
      expect(headers[1].className).toContain('waffle-sortable-asc');
      expect(headers[1].className).not.toContain('waffle-sortable-desc');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');

      expect(footers[1].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[2].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[1].className).toContain('waffle-sortable');
      expect(footers[1].className).toContain('waffle-sortable-asc');
      expect(footers[1].className).not.toContain('waffle-sortable-desc');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');

      expect(grid.$data.toArray()).toBeSorted((o1, o2) => o1.id - o2.id);
      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === grid.$data[idx].id.toString());
    });

    it('should sort grid in descendant order using one field', () => {
      grid.sortBy('-id');

      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'id',
        asc: false
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[2].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[1].className).toContain('waffle-sortable');
      expect(headers[1].className).toContain('waffle-sortable-desc');
      expect(headers[1].className).not.toContain('waffle-sortable-asc');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[1].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[2].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[1].className).toContain('waffle-sortable');
      expect(footers[1].className).toContain('waffle-sortable-desc');
      expect(footers[1].className).not.toContain('waffle-sortable-asc');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(grid.$data.toArray()).toBeSorted((o1, o2) => (o1.id - o2.id) * -1);
      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === grid.$data[idx].id.toString());
    });

    it('should sort grid in ascendant using two fields', () => {
      grid.sortBy(['firstName', '-lastName']);

      expect(grid.$comparators.length).toBe(2);

      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: false
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBe('-');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBe('-');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

      expect(grid.$data.toArray()).toBeSorted((o1, o2) => (
        (o1.firstName.localeCompare(o2.firstName)) || (o1.lastName.localeCompare(o2.lastName) * -1)
      ));

      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[3].innerHTML === grid.$data[idx].lastName.toString());
    });

    it('should sort data when column header is clicked', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(headers[2]);

      // Th should have flag
      expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: false
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
    });

    it('should sort data when column footer is clicked', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(footers[2]);

      // Th should have flag
      expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: false
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
    });

    it('should not sort data when column header is clicked and column is not sortable', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[1]);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.$comparators).toBeDefined();
      expect(grid.$comparators).toBeEmpty();
    });

    it('should not sort data when column footer is clicked and column is not sortable', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[1]);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.$comparators).toBeDefined();
      expect(grid.$comparators).toBeEmpty();
    });

    it('should sort data when column header is clicked using two field if shift key is pressed', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      grid.sortBy.calls.reset();

      triggerClick(headers[3], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith([
        jasmine.objectContaining({
          id: 'firstName',
          asc: true
        }),
        '+lastName'
      ]);

      expect(grid.$comparators.length).toBe(2);

      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: true
      }));

      grid.sortBy.calls.reset();

      // New click on id should reverse order of id column
      triggerClick(headers[2], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith([
        jasmine.objectContaining({
          id: 'lastName',
          asc: true
        }),
        '-firstName'
      ]);

      expect(grid.$comparators.length).toBe(2);

      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: true
      }));

      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: false
      }));
    });

    it('should sort data when column footer is clicked using two field if shift key is pressed', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(footers[3], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith([
        jasmine.objectContaining({
          id: 'firstName',
          asc: true
        }),
        '+lastName'
      ]);

      expect(grid.$comparators.length).toBe(2);

      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: true
      }));

      grid.sortBy.calls.reset();

      // New click on id should reverse order of id column
      triggerClick(footers[2], true, false);

      expect(grid.sortBy).toHaveBeenCalledWith([
        jasmine.objectContaining({
          id: 'lastName',
          asc: true
        }),
        '-firstName'
      ]);

      expect(grid.$comparators.length).toBe(2);

      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: true
      }));

      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: false
      }));
    });
  });

  describe('once initialized without footer', () => {
    let headers;

    beforeEach(() => {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: true,
          tfoot: false
        }
      });

      headers = grid.$thead[0].childNodes[0].childNodes;
    });

    it('should not sort grid by default', () => {
      expect(grid.$comparators).toBeDefined();
      expect(grid.$comparators).toBeEmpty();

      expect(headers).toVerify(th => th.getAttribute('data-waffle-order') === null);

      // First th is for checkbox

      expect(headers[1].className.split(' ')).not.toContain('waffle-sortable');
      expect(headers[2].className.split(' ')).toContain('waffle-sortable');
      expect(headers[3].className.split(' ')).toContain('waffle-sortable');

      expect(headers).toVerify(th => th.className.split(' ').indexOf('waffle-sortable-asc') < 0);
      expect(headers).toVerify(th => th.className.split(' ').indexOf('waffle-sortable-desc') < 0);
      expect(grid.$data.toArray()).not.toBeSorted((o1, o2) => o1.id - o2.id);

      // First td is for checkbox
      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === data[idx].id.toString());
    });

    it('should sort grid in ascendant order using one field', () => {
      grid.sortBy('id');

      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'id',
        asc: true
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[2].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[1].className).toContain('waffle-sortable');
      expect(headers[1].className).toContain('waffle-sortable-asc');
      expect(headers[1].className).not.toContain('waffle-sortable-desc');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');

      expect(grid.$data.toArray()).toBeSorted((o1, o2) => o1.id - o2.id);
      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === grid.$data[idx].id.toString());
    });

    it('should sort grid in descendant order using one field', () => {
      grid.sortBy('-id');

      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'id',
        asc: false
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[2].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[1].className).toContain('waffle-sortable');
      expect(headers[1].className).toContain('waffle-sortable-desc');
      expect(headers[1].className).not.toContain('waffle-sortable-asc');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(grid.$data.toArray()).toBeSorted((o1, o2) => (o1.id - o2.id) * -1);
      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === grid.$data[idx].id.toString());
    });

    it('should sort grid in ascendant using two fields', () => {
      grid.sortBy(['firstName', '-lastName']);

      expect(grid.$comparators.length).toBe(2);

      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: false
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBe('-');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(grid.$data.toArray()).toBeSorted((o1, o2) => (
        (o1.firstName.localeCompare(o2.firstName)) || (o1.lastName.localeCompare(o2.lastName) * -1)
      ));

      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[3].innerHTML === grid.$data[idx].lastName.toString());
    });

    it('should sort data when column header is clicked', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(headers[2]);

      // Th should have flag
      expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: false
      }));

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');
    });

    it('should not sort data when column header is clicked and column is not sortable', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[1]);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.$comparators).toBeDefined();
      expect(grid.$comparators).toBeEmpty();
    });

    it('should sort data when column header is clicked using two field if shift key is pressed', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(headers[3], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith([
        jasmine.objectContaining({
          id: 'firstName',
          asc: true
        }),
        '+lastName'
      ]);

      expect(grid.$comparators.length).toBe(2);

      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: true
      }));

      grid.sortBy.calls.reset();

      // New click on id should reverse order of id column
      triggerClick(headers[2], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith([
        jasmine.objectContaining({
          id: 'lastName',
          asc: true
        }),
        '-firstName'
      ]);

      expect(grid.$comparators.length).toBe(2);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: true
      }));
      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: false
      }));
    });
  });

  describe('once initialized without header', () => {
    let footers;

    beforeEach(() => {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: false,
          tfoot: true
        }
      });

      footers = grid.$tfoot[0].childNodes[0].childNodes;
    });

    it('should not sort grid by default', () => {
      expect(grid.$comparators).toBeDefined();
      expect(grid.$comparators).toBeEmpty();

      expect(footers).toVerify(th => th.getAttribute('data-waffle-order') === null);

      // First th is for checkbox

      expect(footers[1].className.split(' ')).not.toContain('waffle-sortable');
      expect(footers[2].className.split(' ')).toContain('waffle-sortable');
      expect(footers[3].className.split(' ')).toContain('waffle-sortable');

      expect(footers).toVerify(th => th.className.split(' ').indexOf('waffle-sortable-asc') < 0);
      expect(footers).toVerify(th => th.className.split(' ').indexOf('waffle-sortable-desc') < 0);
      expect(grid.$data.toArray()).not.toBeSorted((o1, o2) => o1.id - o2.id);

      // First td is for checkbox
      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === data[idx].id.toString());
    });

    it('should sort grid in ascendant order using one field', () => {
      grid.sortBy('id');

      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'id',
        asc: true
      }));

      expect(footers[1].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[2].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[1].className).toContain('waffle-sortable');
      expect(footers[1].className).toContain('waffle-sortable-asc');
      expect(footers[1].className).not.toContain('waffle-sortable-desc');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');

      expect(grid.$data.toArray()).toBeSorted((o1, o2) => o1.id - o2.id);
      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === grid.$data[idx].id.toString());
    });

    it('should sort grid in descendant order using one field', () => {
      grid.sortBy('-id');

      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'id',
        asc: false
      }));

      expect(footers[1].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[2].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[1].className).toContain('waffle-sortable');
      expect(footers[1].className).toContain('waffle-sortable-desc');
      expect(footers[1].className).not.toContain('waffle-sortable-asc');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(grid.$data.toArray()).toBeSorted((o1, o2) => (o1.id - o2.id) * -1);
      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[1].innerHTML === grid.$data[idx].id.toString());
    });

    it('should sort grid in ascendant using two fields', () => {
      grid.sortBy(['firstName', '-lastName']);

      expect(grid.$comparators.length).toBe(2);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));
      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: false
      }));

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBe('-');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

      expect(grid.$data.toArray()).toBeSorted((o1, o2) => (
        (o1.firstName.localeCompare(o2.firstName)) || (o1.lastName.localeCompare(o2.lastName) * -1)
      ));

      expect(grid.$tbody[0].childNodes).toVerify((tr, idx) => tr.childNodes[3].innerHTML === grid.$data[idx].lastName.toString());
    });

    it('should sort data when column footer is clicked', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(footers[2]);

      // Th should have flag
      expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: false
      }));

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
    });

    it('should not sort data when column footer is clicked and column is not sortable', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[1]);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.$comparators).toBeDefined();
      expect(grid.$comparators).toBeEmpty();
    });

    it('should sort data when column footer is clicked using two field if shift key is pressed', () => {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$comparators.length).toBe(1);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      grid.sortBy.calls.reset();

      triggerClick(footers[3], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith([
        jasmine.objectContaining({
          id: 'firstName',
          asc: true
        }),
        '+lastName'
      ]);

      expect(grid.$comparators.length).toEqual(2);

      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: true
      }));

      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: true
      }));

      grid.sortBy.calls.reset();

      // New click on id should reverse order of id column
      triggerClick(footers[2], true, false);

      expect(grid.sortBy).toHaveBeenCalledWith([
        jasmine.objectContaining({
          id: 'lastName',
          asc: true
        }),
        '-firstName'
      ]);

      expect(grid.$comparators.length).toBe(2);
      expect(grid.$comparators[0]).toEqual(jasmine.objectContaining({
        id: 'lastName',
        asc: true
      }));
      expect(grid.$comparators[1]).toEqual(jasmine.objectContaining({
        id: 'firstName',
        asc: false
      }));
    });
  });
});
