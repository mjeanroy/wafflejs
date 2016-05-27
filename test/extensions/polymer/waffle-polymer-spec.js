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

describe('waffle-polymer', () => {

  let origPolymer;
  let Polymer;
  let table;

  const restore = (o, prop, val) => {
    if (val) {
      o[prop] = val;
    } else {
      delete o[prop];
    }
  };

  beforeEach(() => {
    origPolymer = window.Polymer;

    Polymer = jasmine.createSpyObj('Polymer', ['dom']);
    Polymer.dom.flush = jasmine.createSpy('flush');
    window.Polymer = Polymer;

    table = document.createElement('table');
  });

  afterEach(() => restore(window, 'Polymer', origPolymer));

  it('should have properties', () => {
    expect(PolymerBehavior.properties).toEqual({
      options: {
        type: Object,
        notify: false
      }
    });
  });

  it('should initialize grid on ready listener', () => {
    spyOn(Waffle, 'create').and.callThrough();
    spyOn(Grid.prototype, 'addEventListener').and.callThrough();

    const ctx = document.createElement('div');
    ctx.appendChild(table);
    ctx.fire = jasmine.createSpy('fire');

    Polymer.dom.and.returnValue(ctx);

    PolymerBehavior.ready.call(ctx);

    expect(Polymer.dom).toHaveBeenCalledWith(ctx);
    expect(Polymer.dom.flush).toHaveBeenCalled();

    expect(Waffle.create).toHaveBeenCalledWith(table, undefined);
    expect(ctx.$grid).toBeDefined();
    expect(ctx.$grid.addEventListener).toHaveBeenCalled();

    const events = _.keys(Waffle.options.events);
    const nbEvents = events.length;
    expect(ctx.$grid.addEventListener.calls.count()).toBe(nbEvents);

    // Trigger one event and check that fire method is called
    expect(ctx.fire).not.toHaveBeenCalled();
    ctx.$grid.dispatchEvent('initialized');
    expect(ctx.fire).toHaveBeenCalled();

    // We should get the grid
    expect(PolymerBehavior.grid.call(ctx)).toBe(ctx.$grid);
  });

  it('should initialize grid and create table on ready listener', () => {
    spyOn(Waffle, 'create').and.callThrough();
    spyOn(Grid.prototype, 'addEventListener').and.callThrough();

    const ctx = document.createElement('div');
    ctx.fire = jasmine.createSpy('fire');
    ctx.firstElementChild = null;
    spyOn(ctx, 'appendChild').and.callThrough();

    Polymer.dom.and.returnValue(ctx);

    PolymerBehavior.ready.call(ctx);

    expect(Polymer.dom).toHaveBeenCalledWith(ctx);
    expect(Polymer.dom.flush).toHaveBeenCalled();
    expect(ctx.appendChild).toHaveBeenCalled();

    expect(Waffle.create).toHaveBeenCalled();
    expect(ctx.$grid).toBeDefined();
    expect(ctx.$grid.$table).toBeDefined();
    expect(ctx.$grid.addEventListener).toHaveBeenCalled();

    const events = _.keys(Waffle.options.events);
    const nbEvents = events.length;
    expect(ctx.$grid.addEventListener.calls.count()).toBe(nbEvents);

    // Trigger one event and check that fire method is called
    expect(ctx.fire).not.toHaveBeenCalled();
    ctx.$grid.dispatchEvent('initialized');
    expect(ctx.fire).toHaveBeenCalled();

    // We should get the grid
    expect(PolymerBehavior.grid.call(ctx)).toBe(ctx.$grid);
  });
});
