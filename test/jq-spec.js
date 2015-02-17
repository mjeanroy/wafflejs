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

describe('jq', function() {

  var fixtures;
  var node1;
  var node2;

  beforeEach(function() {
    fixtures = document.createElement('div');
    node1 = document.createElement('div');
    node2 = document.createElement('div');
  });

  it('should return instance of jq', function() {
    var $div = jq([node1, node2]);
    expect($div).toBeDefined();
    expect($div).toBeInstanceOf(jq);

    expect($div[0]).toBe(node1);
    expect($div[1]).toBe(node2);
  });

  it('should return exact instance of jq', function() {
    var $div = jq([node1, node2]);
    var $other = jq($div);
    expect($other).toBe($div);
  });

  describe('once created', function() {
    var $div;

    beforeEach(function() {
      $div = jq([node1, node2]);
    });

    it('should clear node content', function() {
      node1.innerHTML = 'foo';
      node2.innerHTML = 'bar';

      var $result = $div.empty();

      expect($result).toBe($div);
      expect(node1.innerHTML).toBe('');
      expect(node1.innerHTML).toBe('');
    });

    it('should remove nodes', function() {
      var fixtures = document.createElement('fixtures');
      fixtures.appendChild(node1);
      fixtures.appendChild(node2);

      var $result = $div.remove();

      expect($result).toBe($div);
      expect(node1.parentNode).toBeNull();
      expect(node2.parentNode).toBeNull();
    });

    it('should append node', function() {
      var childNode = document.createElement('span');
      childNode.innerHTML = 'foo';

      var $result = $div.append(childNode);

      expect($result).toBe($div);
      expect(node1.innerText).toBe('foo');
      expect(node2.innerText).toBe('foo');
    });

    it('should set html content', function() {
      var $result = $div.html('foo bar');

      expect($result).toBe($div);
      expect($div[0].innerHTML).toBe('foo bar');
    });

    it('should add class to node', function() {
      var $result = $div.addClass('foo');
      expect($result).toBe($div);
      expect($div[0].className).toBe(' foo');
    });

    it('should add array of classes to node', function() {
      var $result = $div.addClass(['foo', 'bar']);
      expect($result).toBe($div);
      expect($div[0].className).toBe(' foo bar');
    });
  });
});