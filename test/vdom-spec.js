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

describe('$vdom', function() {

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

  it('should update node attribute', function() {
    var node1 = document.createElement('div');
    node1.setAttribute('data-foo', 'bar');
    node1.setAttribute('data-idx', 1);

    var node2 = document.createElement('div');
    node2.setAttribute('data-foo', 'foo');
    node2.setAttribute('data-idx', 2);

    $vdom.mergeAttributes(node1, node2);

    expect(node1.getAttribute('data-foo')).toBe('foo');
    expect(node1.getAttribute('data-idx')).toBe('2');
  });

  it('should update node attribute and add new ones', function() {
    var node1 = document.createElement('div');
    node1.setAttribute('data-idx', 1);

    var node2 = document.createElement('div');
    node2.setAttribute('data-foo', 'foo');
    node2.setAttribute('data-idx', 2);

    $vdom.mergeAttributes(node1, node2);

    expect(node1.getAttribute('data-foo')).toBe('foo');
    expect(node1.getAttribute('data-idx')).toBe('2');
  });

  it('should update node attribute and remove old ones', function() {
    var node1 = document.createElement('div');
    node1.setAttribute('data-foo', 'foo');
    node1.setAttribute('data-idx', 1);

    var node2 = document.createElement('div');
    node2.setAttribute('data-idx', 2);

    $vdom.mergeAttributes(node1, node2);

    expect(node1.getAttribute('data-foo')).toBeNull();
    expect(node1.getAttribute('data-idx')).toBe('2');
  });

  it('should update node inline styles', function() {
    var node1 = document.createElement('div');
    node1.style.width = '100px';
    node1.style.height = '200px';

    var node2 = document.createElement('div');
    node2.style.width = '110px';
    node2.style.height = '210px';

    $vdom.mergeAttributes(node1, node2);

    expect(node1.style.width).toBe('110px');
    expect(node1.style.height).toBe('210px');
  });

  it('should update node inline styles and add new ones', function() {
    var node1 = document.createElement('div');
    node1.style.width = '100px';

    var node2 = document.createElement('div');
    node2.style.width = '110px';
    node2.style.height = '210px';

    $vdom.mergeAttributes(node1, node2);

    expect(node1.style.width).toBe('110px');
    expect(node1.style.height).toBe('210px');
  });

  it('should update node inline styles and remove old ones', function() {
    var node1 = document.createElement('div');
    node1.style.width = '100px';
    node1.style.height = '200px';

    var node2 = document.createElement('div');
    node2.style.width = '110px';

    $vdom.mergeAttributes(node1, node2);

    expect(node1.style.width).toBe('110px');
    expect(node1.style.height).toBeEmpty();
  });

  it('should update node classes', function() {
    var node1 = document.createElement('div');
    node1.className = 'foo bar';

    var node2 = document.createElement('div');
    node2.className = 'foo';

    $vdom.mergeAttributes(node1, node2);

    expect(node1.className).toBe('foo');
  });

  it('should merge two nodes', function() {
    spyOn($vdom, 'mergeAttributes').and.callThrough();

    var node1 = document.createElement('div');
    var node2 = document.createElement('div');

    var span1 = document.createElement('span');
    span1.className = 'foo-1';
    span1.setAttribute('foo', 'foo1');
    span1.style.width = '100px';
    span1.innerHTML = 'foo #1';

    var span2 = document.createElement('span');
    span2.className = 'foo-2';
    span2.setAttribute('foo', 'foo2');
    span2.style.width = '200px';
    span2.innerHTML = 'foo #2';

    node1.appendChild(span1);
    node2.appendChild(span2);

    var rootNode = document.createElement('div');
    rootNode.appendChild(node1);
    rootNode.appendChild(node2);

    $vdom.mergeNodes(rootNode, node1, node2);

    expect($vdom.mergeAttributes).toHaveBeenCalledWith(node1, node2);
    expect($vdom.mergeAttributes).toHaveBeenCalledWith(span1, span2);

    expect(node1.childNodes.length).toBe(1);
    expect(node1.childNodes[0].className).toBe('foo-2');
    expect(node1.childNodes[0].getAttribute('foo')).toBe('foo2');
    expect(node1.childNodes[0].innerHTML).toBe('foo #2');
  });

  it('should update content of nodes', function() {
    spyOn($vdom, 'mergeAttributes').and.callThrough();

    var node1 = document.createElement('div');
    var node2 = document.createElement('div');

    var span = document.createElement('span');
    span.className = 'foo-1';
    span.setAttribute('foo', 'foo1');
    span.style.width = '100px';
    span.innerHTML = 'foo #1';

    var input = document.createElement('input');
    input.setAttribute('type', 'text');

    node1.appendChild(span);
    node2.appendChild(input);

    var rootNode = document.createElement('div');
    rootNode.appendChild(node1);
    rootNode.appendChild(node2);

    $vdom.mergeNodes(rootNode, node1, node2);

    expect($vdom.mergeAttributes).toHaveBeenCalledWith(node1, node2);
    expect($vdom.mergeAttributes).not.toHaveBeenCalledWith(span, input);
    expect(node1.childNodes.length).toBe(1);
    expect(node1.childNodes[0]).toBe(input);
  });

  it('should update content of nodes if nodes do not have same child length', function() {
    spyOn($vdom, 'mergeAttributes').and.callThrough();

    var node1 = document.createElement('div');
    var node2 = document.createElement('div');

    var span1 = document.createElement('span');
    span1.className = 'foo-1';
    span1.setAttribute('foo', 'foo1');
    span1.style.width = '100px';
    span1.innerHTML = 'foo #1';

    var span2 = document.createElement('span');
    span2.className = 'foo-1';
    span2.setAttribute('foo', 'foo1');
    span2.style.width = '100px';
    span2.innerHTML = 'foo #1';

    var input = document.createElement('input');
    input.setAttribute('type', 'text');

    node1.appendChild(span1);
    node2.appendChild(span2);
    node2.appendChild(input);

    var rootNode = document.createElement('div');
    rootNode.appendChild(node1);
    rootNode.appendChild(node2);

    $vdom.mergeNodes(rootNode, node1, node2);

    expect($vdom.mergeAttributes).toHaveBeenCalledWith(node1, node2);
    expect($vdom.mergeAttributes).not.toHaveBeenCalledWith(span1, span2);
    expect($vdom.mergeAttributes).not.toHaveBeenCalledWith(span1, input);

    expect(node1.childNodes.length).toBe(2);
    expect(node1.childNodes[0]).toBe(span2);
    expect(node1.childNodes[1]).toBe(input);
  });
});
