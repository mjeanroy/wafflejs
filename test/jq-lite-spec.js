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

    fixtures.appendChild(node1);
    fixtures.appendChild(node2);

    document.body.appendChild(fixtures);
  });

  afterEach(function() {
    document.body.removeChild(fixtures);
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

      expect(node1.childNodes.length).toBe(0);
      expect(node2.childNodes.length).toBe(0);

      var $result = $div.append(childNode);

      expect($result).toBe($div);
      expect(node2.childNodes.length).toBe(1);

      // With angular.js, jqLite append only to last element
      // Bug ?
      // expect(node1.childNodes.length).toBe(1);
    });

    it('should append node after element', function() {
      var childNode = document.createElement('span');
      childNode.innerHTML = 'foo';

      expect(node1.childNodes.length).toBe(0);
      expect(node2.childNodes.length).toBe(0);

      var $n1 = $($div[0]);
      var $result = $n1.after(childNode);

      expect($result).toBe($n1);
      expect(node1.nextSibling).toBe(childNode);
      expect(node2.nextSibling).toBeNull();
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

    it('should remove class of node', function() {
      $div[0].className = 'foo bar foobar';
      $div[1].className = 'foo foobar';

      $div.removeClass('foo foobar');

      expect($div[0].className).toBe('bar');
      expect($div[1].className).toBe('');
    });

    it('should get element at given index', function() {
      var $node1 = $div.eq(1);
      expect($node1).toBeInstanceOf($);
      expect($node1[0]).toBe($div[1]);
    });

    it('should get children', function() {
      var span1 = document.createElement('span');
      span1.setAttribute('id', 'span1');
      var span2 = document.createElement('span');
      span2.setAttribute('id', 'span2');

      $div[0].appendChild(span1);
      $div[1].appendChild(span2);

      var $children = $div.children();
      expect($children).toBeInstanceOf($);
      expect($children.length).toBe(2);
      expect($children[0].getAttribute('id')).toBe('span1');
      expect($children[1].getAttribute('id')).toBe('span2');
    });

    it('should bind and unbind event', function() {
      // Bind and check callbacks
      var callback = jasmine.createSpy('callback');
      $div.on('click', callback);

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([
          { event: 'click', node: $div[0], callback: callback },
          { event: 'click', node: $div[1], callback: callback }
        ]);
      }

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

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([]);
      }

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

    it('should remove node attributes', function() {
      var name = 'data-foo';
      var value = '1';

      $div[0].setAttribute(name, value);
      $div[1].setAttribute(name, value);

      expect($div[0].getAttribute(name)).toBe(value);
      expect($div[1].getAttribute(name)).toBe(value);

      $div.removeAttr(name);

      expect($div[0].getAttribute(name)).toBeNull();
      expect($div[1].getAttribute(name)).toBeNull();
    });
  });
});
