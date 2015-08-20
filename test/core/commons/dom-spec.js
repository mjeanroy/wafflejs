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

describe('$doc', function() {

  var fixtures;

  beforeEach(function() {
    fixtures = document.createElement('div');
    fixtures.setAttribute('id', 'fixtures');

    var node1 = document.createElement('span');
    node1.setAttribute('id', 'span1');
    fixtures.appendChild(node1);

    var node2 = document.createElement('span');
    node2.setAttribute('id', 'span2');
    fixtures.appendChild(node2);

    document.body.appendChild(fixtures);
  });

  afterEach(function() {
    fixtures.parentNode.removeChild(fixtures);
  });

  it('should find element by id', function() {
    var node = $doc.byId('span1');
    var unknownNode = $doc.byId('foo');

    expect(node).toBeDefined();
    expect(node.length).toBe(1);

    expect(unknownNode).toBeDefined();
    expect(unknownNode.length).toBe(0);
  });

  it('should find element by tag name', function() {
    var nodes = $doc.byTagName('span');
    var unknownNodes = $doc.byTagName('foo');
    expect(nodes).toBeDefined();
    expect(nodes.length).toBe(2);

    expect(unknownNodes).toBeDefined();
    expect(unknownNodes.length).toBe(0);
  });

  it('should find element by tag name of parent node', function() {
    spyOn(fixtures, 'getElementsByTagName').and.callThrough();
    var nodes = $doc.byTagName('span', fixtures);

    expect(fixtures.getElementsByTagName).toHaveBeenCalled();
    expect(nodes).toBeDefined();
    expect(nodes.length).toBe(2);
  });

  it('should create new empty document fragment', function() {
    var fragment = $doc.createFragment();
    expect(fragment).toBeDefined();
    expect(fragment instanceof DocumentFragment).toBe(true);
  });

  it('should create tr element', function() {
    var node = $doc.tr();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TR');
  });

  it('should create td element', function() {
    var node = $doc.td();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TD');
  });

  it('should create th element', function() {
    var node = $doc.th();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TH');
  });

  it('should create tbody element', function() {
    var node = $doc.tbody();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TBODY');
  });

  it('should create thead element', function() {
    var node = $doc.thead();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('THEAD');
  });

  it('should create tfoot element', function() {
    var node = $doc.tfoot();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('TFOOT');
  });

  it('should create input element', function() {
    var node = $doc.input();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
  });

  it('should create input type "checkbox" element', function() {
    var node = $doc.inputCheckbox();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('checkbox');
  });

  it('should create input type "text" element', function() {
    var node = $doc.inputText();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('text');
  });

  it('should create input type "number" element', function() {
    var node = $doc.inputNumber();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('number');
  });

  it('should create input type "email" element', function() {
    var node = $doc.inputEmail();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('email');
  });

  it('should create input type "email" element', function() {
    var node = $doc.inputUrl();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('url');
  });

  it('should create input type "date" element', function() {
    var node = $doc.inputDate();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('date');
  });

  it('should create input type "time" element', function() {
    var node = $doc.inputTime();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('time');
  });

  it('should create input type "datetime" element', function() {
    var node = $doc.inputDatetime();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('INPUT');
    expect(node.getAttribute('type')).toBe('datetime');
  });

  it('should create select element', function() {
    var node = $doc.select();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('SELECT');
  });

  it('should create option element', function() {
    var node = $doc.option();
    expect(node).toBeDefined();
    expect(node.tagName).toBe('OPTION');
  });

  it('should find parent', function() {
    var nodes = $doc.byTagName('span');
    var parent = $doc.findParent(nodes[0], 'DIV');
    expect(parent).toBe(fixtures);
  });

  it('should return undefined if parent does not exist', function() {
    var nodes = $doc.byTagName('span');
    var parent = $doc.findParent(nodes[0], 'TABLE');
    expect(parent).toBeNull();
  });

  it('should get size of scrollbar', function() {
    var size = $doc.scrollbarWidth();
    expect(size).toBeDefined();
    expect(size).not.toBeZero();
    expect(size).toBePositive();
  });
});
