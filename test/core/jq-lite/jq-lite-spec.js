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

describe('$', () => {

  let node1;
  let node2;

  beforeEach(() => {
    node1 = document.createElement('div');
    node2 = document.createElement('div');

    fixtures.appendChild(node1);
    fixtures.appendChild(node2);
  });

  it('should return instance of $', () => {
    const $div = $([node1, node2]);
    expect($div).toBeDefined();
    expect($div).toBeInstanceOf($);

    expect($div[0]).toBe(node1);
    expect($div[1]).toBe(node2);
  });

  it('should return instance of $', () => {
    const $div = $([node1, node2]);
    const $other = $($div);
    expect($other.length).toBe($div.length);
    expect($other[0]).toBe($div[0]);
    expect($other[1]).toBe($div[1]);
  });

  it('should return instance of $window', () => {
    const $window = $(window);

    expect($window.length).toBe(1);
    expect($window[0]).toBe(window);
  });

  describe('once created', () => {
    let $div;

    beforeEach(() => {
      $div = $([node1, node2]);
    });

    it('should clear node content', () => {
      node1.innerHTML = 'foo';
      node2.innerHTML = 'bar';

      const $result = $div.empty();

      expect($result).toBe($div);
      expect(node1.innerHTML).toBe('');
      expect(node1.innerHTML).toBe('');
    });

    it('should append node', () => {
      const childNode = document.createElement('span');
      childNode.innerHTML = 'foo';

      expect(node1.childNodes.length).toBe(0);
      expect(node2.childNodes.length).toBe(0);

      const $result = $div.append(childNode);

      expect($result).toBe($div);
      expect(node2.childNodes.length).toBe(1);

      // With angular.js, jqLite append only to last element
      // Bug ?
      // expect(node1.childNodes.length).toBe(1);
    });

    it('should prepend node', () => {
      const childNode = document.createElement('span');
      childNode.innerHTML = 'foo';

      expect(node1.childNodes.length).toBe(0);
      expect(node2.childNodes.length).toBe(0);

      const $result = $div.prepend(childNode);

      expect($result).toBe($div);
      expect(node2.childNodes[0]).toBe(childNode);

      // With angular.js, jqLite append only to last element
      // Bug ?
      // expect(node1.childNodes.length).toBe(1);
    });

    it('should append node after element', () => {
      const childNode = document.createElement('span');
      childNode.innerHTML = 'foo';

      expect(node1.childNodes.length).toBe(0);
      expect(node2.childNodes.length).toBe(0);

      const $n1 = $($div[0]);
      const $result = $n1.after(childNode);

      expect($result).toBe($n1);
      expect(node1.nextSibling).toBe(childNode);
      expect(node2.nextSibling).toBeNull();
    });

    it('should add inline style to node', () => {
      const $result = $div.css('max-height', '10px');
      expect($result).toBe($div);
      expect($div[0].style['max-height']).toEqual('10px');
    });

    it('should add inline styles defined as object to node', () => {
      const $result = $div.css({
        'max-height': '10px',
        'max-width': '20px'
      });

      expect($result).toBe($div);
      expect($div[0].style['max-height']).toEqual('10px');
      expect($div[0].style['max-width']).toEqual('20px');
    });

    it('should add class to node', () => {
      const $result = $div.addClass('foo');
      expect($result).toBe($div);
      expect($div[0].className).toBe('foo');
    });

    it('should remove class of node', () => {
      $div[0].className = 'foo bar foobar';
      $div[1].className = 'foo foobar';

      $div.removeClass('foo foobar');

      expect($div[0].className).toBe('bar');
      expect($div[1].className).toBe('');
    });

    it('should get element at given index', () => {
      const $node1 = $div.eq(1);
      expect($node1).toBeInstanceOf($);
      expect($node1[0]).toBe($div[1]);
    });

    it('should get children', () => {
      const span1 = document.createElement('span');
      span1.setAttribute('id', 'span1');
      const span2 = document.createElement('span');
      span2.setAttribute('id', 'span2');

      $div[0].appendChild(span1);
      $div[1].appendChild(span2);

      const $children = $div.children();
      expect($children).toBeInstanceOf($);
      expect($children.length).toBe(2);
      expect($children[0].getAttribute('id')).toBe('span1');
      expect($children[1].getAttribute('id')).toBe('span2');
    });

    it('should bind and unbind event', () => {
      // Bind and check callbacks
      const callback = jasmine.createSpy('callback');
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

    it('should bind and unbind specific event', () => {
      // Bind and check callbacks
      const callback = jasmine.createSpy('callback');
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

    it('should bind and unbind specific listener', () => {
      // Bind and check callbacks
      const callback1 = jasmine.createSpy('callback1');
      const callback2 = jasmine.createSpy('callback2');

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

    it('should bind and unbind list of event', () => {
      // Bind and check callbacks
      const callback = jasmine.createSpy('callback');
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

    it('should bind list of events and unbind some', () => {
      // Bind and check callbacks
      const callback = jasmine.createSpy('callback');
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

    it('should set node attribute', () => {
      const attrName = 'data-foo';
      const attrValue = '1';

      $div.attr('data-foo', '1');

      expect($div[0].getAttribute(attrName)).toBe(attrValue);
      expect($div[1].getAttribute(attrName)).toBe(attrValue);
    });

    it('should set node attributes', () => {
      const a1 = 'data-foo';
      const v1 = '1';
      const a2 = 'data-bar';
      const v2 = '2';

      const attributes = {};
      attributes[a1] = v1;
      attributes[a2] = v2;

      $div.attr(attributes);

      expect($div[0].getAttribute(a1)).toBe(v1);
      expect($div[0].getAttribute(a2)).toBe(v2);

      expect($div[1].getAttribute(a1)).toBe(v1);
      expect($div[1].getAttribute(a2)).toBe(v2);
    });

    it('should remove node attributes', () => {
      const name = 'data-foo';
      const value = '1';

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
