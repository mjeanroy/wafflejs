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

/* global _ */
/* global $parse */

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
 * TODO splice ; reverse
 */

var $$ArrayProto = Array.prototype;

var $$keepNativeArray = (function() {
  try {
    var obj = {};
    obj[0] = 1;
    return !!$$ArrayProto.toString.call(obj);
  } catch(error) {
    return false;
  }
})();

var $$callOnArrayFn = function(fn) {
  return function() {
    // Some browsers, including phantomjs 1.x need a real array
    // to be called as the context of Array prototype function (array like
    // object are not permitted)
    // Newer browsers does not need this, so keep it fast for them !
    var array = $$keepNativeArray ? this : _.toArray(this);
    return $$ArrayProto[fn].apply(array, arguments);
  };
};

var $$callOnArray = function(fn, ctx, args) {
  return $$callOnArrayFn(fn).apply(ctx, args);
};

var Collection = function(data, options) {
  this.$$map = {};

  var opts = options || {};

  this.$$key = opts.key || 'id';
  this.$$model = opts.model;

  if (!_.isFunction(this.$$key)) {
    this.$$key = $parse(this.$$key);
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
      var id = this.$$key(this[i]);
      this[newIndex] = this[i];
      this.$$map[id] = newIndex;
    }
  },

  $$add: function(models, start) {
    if (start < this.length) {
      this.$$move(start, models.length);
    }

    for (var i = 0, size = models.length; i < size; ++i) {
      var current = models[i];
      var model = this.$$model ? new this.$$model(current) : current;
      var modelIdx = start + i;
      var id = this.$$key(model);

      this[modelIdx] = model;
      this.$$map[id] = modelIdx;
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
    var id = this.$$key(value);

    if (index < lastIndex) {
      this.$$move(index, -1);
    }

    this.length--;
    delete this[lastIndex];
    delete this.$$map[id];

    return value;
  },

  $$replaceAll: function(array) {
    var oldSize = this.length;
    var newSize = array.length;
    this.$$map = {};

    for (var i = 0; i < newSize; ++i) {
      var current = array[i];
      var model = this.$$model ? new this.$$model(current) : current;
      var id = this.$$key(model);
      this[i] = model;
      this.$$map[id] = i;
    }

    for (; i < oldSize; ++i) {
      delete this[i];
    }

    this.length = newSize;

    return this;
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

  // Get item by its key value
  byKey: function(key) {
    var index = this.indexByKey(key);
    return index >= 0 ? this[index] : undefined;
  },

  // Get index of item by its key
  indexByKey: function(key) {
    return _.has(this.$$map, key) ? this.$$map[key] : -1;
  },

  // Returns an index in the array, if an element in the array
  // satisfies the provided testing function. Otherwise -1 is returned.
  findIndex: function(callback, ctx) {
    for (var i = 0, size = this.length; i < size; ++i) {
      if (callback.call(ctx, this[i], i, this)) {
        return i;
      }
    }
    return -1;
  },

  // Adds one or more elements to the end of the collection
  // and returns the new length of the collection.
  // Semantic is the same as [].push function
  push: function() {
    var models = _.toArray(arguments);
    return this.$$add(models, this.length);
  },

  // adds one or more elements to the beginning of the collection
  // and returns the new length of the collection.
  // Semantic is the same as [].unshift function
  unshift: function() {
    var models = _.toArray(arguments);
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
  },

  // Returns a new collection comprised of the collection on which it is called
  // joined with the collection(s) and/or value(s) provided as arguments.
  concat: function() {
    var newArray = $$ArrayProto.concat.apply(this.toArray(), arguments);
    return new Collection(newArray, {
      key: this.$$key,
      model: this.$$model
    });
  },

  // returns a shallow copy of a portion of the collection
  // into a new collection object.
  slice: function() {
    var results = $$callOnArray('slice', this, arguments);
    return new Collection(results, {
      key: this.$$key,
      model: this.$$model
    });
  },

  // Custom json representation
  // Need JSON.stringify to be available
  toJSON: function() {
    return JSON.stringify(this.toArray());
  },

  // Sort given collection in place
  // Sorted collection is returned
  sort: function(sortFn) {
    var array = $$callOnArray('sort', this, [sortFn]);
    return this.$$replaceAll(array);
  }
};

_.forEach(['forEach', 'map', 'every', 'some', 'reduce', 'reduceRight', 'filter', 'find', 'toArray'], function(fn) {
  Collection.prototype[fn] = function() {
    var args = [this].concat(_.toArray(arguments));
    return _[fn].apply(_, args);
  };
});

_.forEach(['toString', 'toLocaleString', 'join', 'indexOf', 'lastIndexOf'], function(fn) {
  Collection.prototype[fn] = $$callOnArrayFn(fn);
});
