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

describe('$', function() {

  var fixtures;
  var node1;
  var node2;

  beforeEach(function() {
    fixtures = document.createElement('div');
    node1 = document.createElement('div');
    node2 = document.createElement('div');
  });

  it('should return instance of $', function() {
    var $div = $([node1, node2]);
    expect($div).toBeDefined();
    expect($div).toBeInstanceOf($);

    expect($div[0]).toBe(node1);
    expect($div[1]).toBe(node2);
  });

  it('should return exact instance of $', function() {
    var $div = $([node1, node2]);
    var $other = $($div);
    expect($other).toBe($div);
  });

  describe('once created', function() {
    var $div;

    beforeEach(function() {
      $div = $([node1, node2]);
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
      expect($div[0].className).toBe('foo');
    });

    it('should add array of classes to node', function() {
      var $result = $div.addClass(['foo', 'bar']);
      expect($result).toBe($div);
      expect($div[0].className).toBe('foo bar');
    });

    it('should bind and unbind event', function() {
      // Bind and check callbacks
      var callback = jasmine.createSpy('callback');
      $div.on('click', callback);

      expect($div.$$events).toEqual([
        { event: 'click', node: $div[0], callback: callback },
        { event: 'click', node: $div[1], callback: callback }
      ]);

      var e1 = document.createEvent('MouseEvent');
      e1.initEvent('click', true, true);

      var e2 = document.createEvent('MouseEvent');
      e2.initEvent('click', true, true);

      $div[0].dispatchEvent(e1);
      $div[1].dispatchEvent(e2);

      expect(callback).toHaveBeenCalledWith(e1);
      expect(callback).toHaveBeenCalledWith(e2);

      // Reset spy, Unbind and check callbacks
      callback.calls.reset();
      $div.off();

      expect($div.$$events).toEqual([]);

      $div[0].dispatchEvent(e1);
      $div[1].dispatchEvent(e2);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should set node attribute', function() {
      var attrName = 'data-foo';
      var attrValue = '1';

      $div.attr('data-foo', '1');

      expect($div[0].getAttribute(attrName)).toBe(attrValue);
      expect($div[1].getAttribute(attrName)).toBe(attrValue);
    });

    it('should set node attributes', function() {
      var a1 = 'data-foo';
      var v1 = '1';
      var a2 = 'data-bar';
      var v2 = '2';

      var attributes = {};
      attributes[a1] = v1;
      attributes[a2] = v2;

      $div.attr(attributes);

      expect($div[0].getAttribute(a1)).toBe(v1);
      expect($div[0].getAttribute(a2)).toBe(v2);

      expect($div[1].getAttribute(a1)).toBe(v1);
      expect($div[1].getAttribute(a2)).toBe(v2);
    });
  });
});