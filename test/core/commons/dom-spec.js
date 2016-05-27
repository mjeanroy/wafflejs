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

describe('$doc', () => {

  let fixtures;

  beforeEach(() => {
    fixtures = document.createElement('div');
    fixtures.setAttribute('id', 'fixtures');

    const node1 = document.createElement('span');
    node1.setAttribute('id', 'span1');
    fixtures.appendChild(node1);

    const node2 = document.createElement('span');
    node2.setAttribute('id', 'span2');
    fixtures.appendChild(node2);

    document.body.appendChild(fixtures);
  });

  afterEach(() => fixtures.parentNode.removeChild(fixtures));

  it('should create element', () => {
    const element = $doc.create('div');
    expect(element).toBeDefined();
    expect(element.tagName).toBe('DIV');
  });

  it('should create element with attributes', () => {
    const element = $doc.create('div', {
      'id': 'foo',
      'data-waffle-order': '+'
    });

    expect(element).toBeDefined();
    expect(element.tagName).toBe('DIV');
    expect(element.getAttribute('id')).toBe('foo');
    expect(element.getAttribute('data-waffle-order')).toBe('+');
  });

  it('should create element with attributes and className', () => {
    const element = $doc.create('div', {
      'id': 'foo',
      'data-waffle-order': '+',
      'className': 'foo bar'
    });

    expect(element).toBeDefined();
    expect(element.tagName).toBe('DIV');
    expect(element.getAttribute('id')).toBe('foo');
    expect(element.getAttribute('data-waffle-order')).toBe('+');
    expect(element.className).toBe('foo bar');
  });

  it('should create element with attributes and styles', () => {
    const element = $doc.create('div', {
      'id': 'foo',
      'data-waffle-order': '+',
      'style': {
        'fontSize': '10px'
      }
    });

    expect(element).toBeDefined();
    expect(element.tagName).toBe('DIV');
    expect(element.getAttribute('id')).toBe('foo');
    expect(element.getAttribute('data-waffle-order')).toBe('+');
    expect(element.style.fontSize).toBe('10px');
  });

  it('should create element with children', () => {
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    const element = $doc.create('div', null, [span1, span2]);

    expect(element).toBeDefined();
    expect(element.tagName).toBe('DIV');

    expect(element.childNodes.length).toBe(2);
    expect(element.childNodes[0]).toBe(span1);
    expect(element.childNodes[1]).toBe(span2);
  });

  it('should create element with text node', () => {
    const element = $doc.create('div', null, 'Hello World');

    expect(element).toBeDefined();
    expect(element.tagName).toBe('DIV');

    expect(element.childNodes.length).toBe(1);
    expect(element.childNodes[0].nodeValue).toBe('Hello World');
  });

  it('should create element with html', () => {
    const element = $doc.create('div', null, '<b>Hello World</b>');

    expect(element).toBeDefined();
    expect(element.tagName).toBe('DIV');
    expect(element.innerHTML).toBe('<b>Hello World</b>');
  });

  it('should find element by id', () => {
    const node = $doc.byId('span1');
    const unknownNode = $doc.byId('foo');

    expect(node).toBeDefined();
    expect(node.length).toBe(1);

    expect(unknownNode).toBeDefined();
    expect(unknownNode.length).toBe(0);
  });

  it('should find element by tag name', () => {
    const nodes = $doc.byTagName('span');
    const unknownNodes = $doc.byTagName('foo');
    expect(nodes).toBeDefined();
    expect(nodes.length).toBe(2);

    expect(unknownNodes).toBeDefined();
    expect(unknownNodes.length).toBe(0);
  });

  it('should find element by tag name of parent node', () => {
    spyOn(fixtures, 'getElementsByTagName').and.callThrough();
    const nodes = $doc.byTagName('span', fixtures);

    expect(fixtures.getElementsByTagName).toHaveBeenCalled();
    expect(nodes).toBeDefined();
    expect(nodes.length).toBe(2);
  });

  it('should create new empty document fragment', () => {
    const fragment = $doc.createFragment();
    expect(fragment).toBeDefined();
    expect(fragment instanceof DocumentFragment).toBe(true);
  });

  it('should create tr element', () => {
    const node = $doc.tr();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TR');
  });

  it('should create td element', () => {
    const node = $doc.td();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TD');
  });

  it('should create th element', () => {
    const node = $doc.th();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TH');
  });

  it('should create tbody element', () => {
    const node = $doc.tbody();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TBODY');
  });

  it('should create thead element', () => {
    const node = $doc.thead();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('THEAD');
  });

  it('should create tfoot element', () => {
    const node = $doc.tfoot();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TFOOT');
  });

  it('should create input element', () => {
    const node = $doc.input();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
  });

  it('should create input type "checkbox" element', () => {
    const node = $doc.inputCheckbox();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('checkbox');
  });

  it('should create input type "text" element', () => {
    const node = $doc.inputText();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('text');
  });

  it('should create input type "number" element', () => {
    const node = $doc.inputNumber();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('number');
  });

  it('should create input type "email" element', () => {
    const node = $doc.inputEmail();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('email');
  });

  it('should create input type "email" element', () => {
    const node = $doc.inputUrl();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('url');
  });

  it('should create input type "date" element', () => {
    const node = $doc.inputDate();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('date');
  });

  it('should create input type "time" element', () => {
    const node = $doc.inputTime();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('time');
  });

  it('should create input type "datetime" element', () => {
    const node = $doc.inputDatetime();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('datetime');
  });

  it('should create select element', () => {
    const node = $doc.select();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('SELECT');
  });

  it('should create option element', () => {
    const node = $doc.option();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('OPTION');
  });

  it('should find parent', () => {
    const nodes = $doc.byTagName('span');
    const parent = $doc.findParent(nodes[0], 'DIV');
    expect(parent).toBe(fixtures);
  });

  it('should return undefined if parent does not exist', () => {
    const nodes = $doc.byTagName('span');
    const parent = $doc.findParent(nodes[0], 'TABLE');
    expect(parent).toBeNull();
  });

  it('should get size of scrollbar', () => {
    const size = $doc.scrollbarWidth();
    expect(size).toBeDefined();
  });
});
