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

  var node1;
  var node2;

  beforeEach(function() {
    node1 = document.createElement('div');
    node2 = document.createElement('div');

    fixtures.appendChild(node1);
    fixtures.appendChild(node2);
  });

  it('should return instance of $', function() {
    var $div = $([node1, node2]);
    expect($div).toBeDefined();
    expect($div).toBeInstanceOf($);

    expect($div[0]).toBe(node1);
    expect($div[1]).toBe(node2);
  });

  it('should return instance of $', function() {
    var $div = $([node1, node2]);
    var $other = $($div);
    expect($other.length).toBe($div.length);
    expect($other[0]).toBe($div[0]);
    expect($other[1]).toBe($div[1]);
  });

  it('should return instance of $window', function() {
    var $window = $(window);

    expect($window.length).toBe(1);
    expect($window[0]).toBe(window);
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

    it('should prepend node', function() {
      var childNode = document.createElement('span');
      childNode.innerHTML = 'foo';

      expect(node1.childNodes.length).toBe(0);
      expect(node2.childNodes.length).toBe(0);

      var $result = $div.prepend(childNode);

      expect($result).toBe($div);
      expect(node2.childNodes[0]).toBe(childNode);

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

    it('should add inline style to node', function() {
      var $result = $div.css('max-height', '10px');
      expect($result).toBe($div);
      expect($div[0].style['max-height']).toEqual('10px');
    });

    it('should add inline styles defined as object to node', function() {
      var $result = $div.css({
        'max-height': '10px',
        'max-width': '20px'
      });

      expect($result).toBe($div);
      expect($div[0].style['max-height']).toEqual('10px');
      expect($div[0].style['max-width']).toEqual('20px');
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

      triggerClick($div[0]);
      triggerClick($div[1]);

      expect(callback).toHaveBeenCalled();

      // Reset spy, Unbind and check callbacks
      callback.calls.reset();
      $div.off();

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([]);
      }

      triggerClick($div[0]);
      triggerClick($div[1]);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should bind and unbind specific event', function() {
      // Bind and check callbacks
      var callback = jasmine.createSpy('callback');
      $div.on('click', callback);
      $div.on('dblclick', callback);

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([
          { event: 'click', node: $div[0], callback: callback },
          { event: 'click', node: $div[1], callback: callback },
          { event: 'dblclick', node: $div[0], callback: callback },
          { event: 'dblclick', node: $div[1], callback: callback }
        ]);
      }

      triggerClick($div[0]);
      expect(callback).toHaveBeenCalled();
      callback.calls.reset();

      triggerDblClick($div[0]);
      expect(callback).toHaveBeenCalled();
      callback.calls.reset();

      $div.off('dblclick');

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([
          { event: 'click', node: $div[0], callback: callback },
          { event: 'click', node: $div[1], callback: callback }
        ]);
      }

      triggerClick($div[0]);
      expect(callback).toHaveBeenCalled();
      callback.calls.reset();

      triggerDblClick($div[0]);
      expect(callback).not.toHaveBeenCalled();
      callback.calls.reset();
    });

    it('should bind and unbind specific listener', function() {
      // Bind and check callbacks
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      $div.on('click', callback1);
      $div.on('click', callback2);

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([
          { event: 'click', node: $div[0], callback: callback1 },
          { event: 'click', node: $div[1], callback: callback1 },
          { event: 'click', node: $div[0], callback: callback2 },
          { event: 'click', node: $div[1], callback: callback2 }
        ]);
      }

      triggerClick($div[0]);

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();

      callback1.calls.reset();
      callback2.calls.reset();

      $div.off('click', callback1);

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([
          { event: 'click', node: $div[0], callback: callback2 },
          { event: 'click', node: $div[1], callback: callback2 }
        ]);
      }

      triggerClick($div[0]);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();

      callback1.calls.reset();
      callback2.calls.reset();
    });

    it('should bind and unbind list of event', function() {
      // Bind and check callbacks
      var callback = jasmine.createSpy('callback');
      $div.on('click dblclick', callback);

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([
          { event: 'click', node: $div[0], callback: callback },
          { event: 'click', node: $div[1], callback: callback },
          { event: 'dblclick', node: $div[0], callback: callback },
          { event: 'dblclick', node: $div[1], callback: callback }
        ]);
      }

      triggerClick($div[0]);
      expect(callback).toHaveBeenCalled();
      callback.calls.reset();

      triggerDblClick($div[0]);
      expect(callback).toHaveBeenCalled();
      callback.calls.reset();

      $div.off('click dblclick');

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([]);
      }

      triggerClick($div[0]);
      expect(callback).not.toHaveBeenCalled();

      triggerDblClick($div[0]);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should bind list of events and unbind some', function() {
      // Bind and check callbacks
      var callback = jasmine.createSpy('callback');
      $div.on('click dblclick', callback);

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([
          { event: 'click', node: $div[0], callback: callback },
          { event: 'click', node: $div[1], callback: callback },
          { event: 'dblclick', node: $div[0], callback: callback },
          { event: 'dblclick', node: $div[1], callback: callback }
        ]);
      }

      triggerClick($div[0]);
      expect(callback).toHaveBeenCalled();
      callback.calls.reset();

      triggerDblClick($div[0]);
      expect(callback).toHaveBeenCalled();
      callback.calls.reset();

      $div.off('click');

      // Test for internal jqLite
      if ($div.$$events) {
        expect($div.$$events).toEqual([
          { event: 'dblclick', node: $div[0], callback: callback },
          { event: 'dblclick', node: $div[1], callback: callback }
        ]);
      }

      triggerClick($div[0]);
      expect(callback).not.toHaveBeenCalled();

      triggerDblClick($div[0]);
      expect(callback).toHaveBeenCalled();
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

    it('should fix node property', function() {
      var node1 = document.createElement('input');
      node1.setAttribute('type', 'checkbox');

      var node2 = document.createElement('input');
      node2.setAttribute('type', 'checkbox');

      $([node1, node2]).prop('checked', true);

      expect(node1.checked).toBeTrue();
      expect(node2.checked).toBeTrue();

      $([node1, node2]).prop('checked', false);

      expect(node1.checked).toBeFalse();
      expect(node2.checked).toBeFalse();
    });

    it('should get the value of input element', function() {
      var input = document.createElement('input');
      input.value = 'foo';
      expect($(input).val()).toBe('foo');
    });

    it('should get the value of select element', function() {
      var select = document.createElement('select');
      select.multiple = false;

      for (var i = 0; i < 3; i++) {
        var option = document.createElement('option');
        option.value = 'foo' + i;
        select.appendChild(option);
      }

      select.selectedIndex = -1;
      expect($(select).val()).toBeFalsy();

      select.selectedIndex = 1;
      expect($(select).val()).toBe('foo1');
    });
  });
});
