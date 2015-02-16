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

/**
 * Collection implementation that can be used
 * to keep internal data indexed using key identifier.
 * Collection is an array like object and implement most
 * methods of array prototype.
 *
 * Limitations:
 *  - Null or undefined data are not allowed (since it must be
 *    indexed using internal property).
 *  - Property must identify uniquely data. Multiple data with
 *    same key are not allowed.
 *  - Key identifier must be a simple type (numeric, string or
 *    boolean).
 *
 * TODO splice ; slice ; indexOf ; lastIndexOf
 */

var Collection = function(data, options) {
  this.$map = {};

  var opts = options || {};

  this.$key = opts.key || 'id';
  this.$model = opts.model;

  if (!$util.isFunction(this.$key)) {
  	this.$key = $parse(this.$key);
  }

  // Initialize collection
  this.length = 0;
  if (data && data.length) {
    this.push.apply(this, data);
  }
};

Collection.prototype = {
  $$move: function(start, size) {
    var collectionSize = this.length;
    for (var i = start; i < collectionSize; ++i) {
      var newIndex = i + size;
      var id = this.$key(this[i]);
      this[newIndex] = this[i];
      this.$map[id] = newIndex;
    }
  },

  $$add: function(models, start) {
    if (start < this.length) {
      this.$$move(start, models.length);
    }

    for (var i = 0, size = models.length; i < size; ++i) {
      var current = models[i];
      var model = this.$model ? new this.$model(current) : current;
      var modelIdx = start + i;
      var id = this.$key(model);

      this[modelIdx] = model;
      this.$map[id] = modelIdx;
      this.length++;
    }

    return this.length;
  },

  $$removeAt: function(index) {
    if (this.isEmpty()) {
      return undefined;
    }

    var lastIndex = this.length - 1;
    var value = this[index];
    var id = this.$key(value);

    if (index < lastIndex) {
      this.$$move(index, -1);
    }

    this.length--;
    delete this[lastIndex];
    delete this.$map[id];

    return value;

  },

  // Get size of collection
  // Shortcut to length property
  size: function() {
    return this.length;
  },

  // Get element at given index
  // Shortcut to array notation
  at: function(index) {
    return this[index];
  },

  // Adds one or more elements to the end of the collection
  // and returns the new length of the collection.
  // Semantic is the same as [].push function
  push: function() {
    var models = $util.clone(arguments);
    return this.$$add(models, this.length);
  },

  // adds one or more elements to the beginning of the collection
  // and returns the new length of the collection.
  // Semantic is the same as [].unshift function
  unshift: function() {
    var models = $util.clone(arguments);
    return this.$$add(models, 0);
  },

  // Check if collection is empty
  isEmpty: function() {
    return this.length === 0;
  },

  // Removes the last element from the collection
  // and returns that element.
  pop: function() {
    return this.$$removeAt(this.length - 1);
  },

  // removes the first element from the collection
  // and returns that element.
  shift: function() {
    return this.$$removeAt(0);
  }
};

$util.forEach(['forEach', 'map', 'every', 'some', 'reduce', 'reduceRight', 'filter'], function(fn) {
  Collection.prototype[fn] = function() {
    var args = [this].concat($util.clone(arguments));
    return $util[fn].apply($util, args);
  };
});

$util.forEach(['toString', 'toLocaleString', 'join'], function(fn) {
  Collection.prototype[fn] = function() {
    return Array.prototype[fn].apply(this, arguments);
  }
});
