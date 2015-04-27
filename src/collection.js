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

/* jshint eqnull:true */

/* global _ */
/* global $parse */
/* global HashMap */
/* exported Collection */

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

var Collection = (function() {

  var ArrayProto = Array.prototype;
  var keepNativeArray = (function() {
    try {
      var obj = {};
      obj[0] = 1;
      return !!ArrayProto.toString.call(obj);
    } catch(error) {
      return false;
    }
  })();

  var callNativeArrayWrapper = function(fn) {
    return function() {
      // Some browsers, including phantomjs 1.x need a real array
      // to be called as the context of Array prototype function (array like
      // object are not permitted)
      // Newer browsers does not need this, so keep it fast for them !
      var array = keepNativeArray ? this : _.toArray(this);
      return ArrayProto[fn].apply(array, arguments);
    };
  };

  var callNativeArrayFn = function(fn, ctx, args) {
    return callNativeArrayWrapper(fn).apply(ctx, args);
  };

  var Constructor = function(data, options) {
    this.$$map = new HashMap();

    var opts = options || {};

    this.$$key = opts.key || 'id';

    // Use Object as a fallback since every object is already an instance of Object !
    this.$$model = opts.model || Object;

    if (!_.isFunction(this.$$key)) {
      this.$$key = $parse(this.$$key);
    }

    this.$$observers = [];
    this.$$changes = [];
    this.$$trigger = _.bind(this.$$trigger, this);

    // Initialize collection
    this.length = 0;
    if (data && data.length) {
      this.push.apply(this, data);
    }
  };

  // == Private functions

  // Unset data at given index.
  var unsetAt = function(collection, idx) {
    delete collection[idx];
  };

  // Unset id entry in internal map of object index.
  var unsetId = function(collection, id) {
    collection.$$map.remove(id);
  };

  // Unset data from collection
  var unset = function(collection, obj) {
    var id = collection.$$key(obj);
    var idx = collection.$$map.get(id);
    if (idx != null) {
      unsetAt(collection, idx);
      unsetId(collection, id);
    }
  };

  // Convert parameter to a model instance.
  var toModel = function(collection, o) {
    return o instanceof collection.$$model ? o : new collection.$$model(o);
  };

  // Add entry at given index.
  // Internal map is updated to keep track of indexes.
  var put = function(collection, o, i) {
    collection[i] = o;
    if (o != null) {
      collection.$$map.put(collection.$$key(o), i);
    }
  };

  // Swap elements at given index
  // Internal map is updated to keep track of indexes.
  var swap = function(collection, i, j) {
    var oj = collection.at(j);
    var oi = collection.at(i);
    put(collection, oi, j);
    put(collection, oj, i);
  };

  // Move all elements of collection to the right.
  // Start index is specified by first parameter.
  // Number of move is specified by second parameter.
  // Size of collection is automatically updated.
  // Exemple:
  //   [0, 1, 2] => shiftRight(0, 2) => [undefined, undefined, 0, 1, 2]
  //   [0, 1, 2] => shiftRight(1, 2) => [0, undefined, undefined, 1, 2]
  //   [0, 1, 2] => shiftRight(2, 2) => [0, 1, undefined, undefined, 2]
  var shiftRight = function(collection, start, size) {
    var absSize = Math.abs(size);

    // Swap elements index by index
    for (var i = collection.length - 1; i >= start; --i) {
      swap(collection, i, i + absSize);
    }

    collection.length += absSize;
  };

  // Move all elements of collection to the left.
  // Start index is specified by first parameter.
  // Number of move is specified by second parameter.
  // Size of collection is automatically updated.
  // Exemple:
  //   [0, 1, 2] => shiftLeft(0, 2) => [2]
  //   [0, 1, 2] => shiftLeft(1, 1) => [0, 2]
  //   [0, 1, 2] => shiftLeft(2, 1) => [0, 1]
  var shiftLeft = function(collection, start, size) {
    var absSize = Math.abs(size);
    var oldLength = collection.length;
    var newLength = oldLength - absSize;
    var max = start + absSize;

    // Swap elements index by index
    for (var i = max; i < oldLength; ++i) {
      swap(collection, i, i - absSize);
    }

    // Clean last elements of array
    for (var k = newLength; k < oldLength; ++k) {
      unset(collection, collection.at(k));
    }

    collection.length = newLength;
  };

  // Move elements of collection
  // If size is positive, it will move elements to the right
  // If size is negative, it will move elements to the left
  var shift = function(collection, start, size) {
    var fn = size > 0 ? shiftRight : shiftLeft;
    return fn.call(this, collection, start, size);
  };

  // == Public prototype

  Constructor.prototype = {
    // TODO refactor and replace with a public function
    $$replaceAll: function(array) {
      var oldSize = this.length;
      var newSize = array.length;

      this.$$map.clear();

      for (var i = 0; i < newSize; ++i) {
        put(this, toModel(this, array[i]), i);
      }

      for (; i < oldSize; ++i) {
        unsetAt(this, i);
      }

      this.length = newSize;

      return this;
    },

    // TODO refactor and replace with a public function
    $$add: function(data, start) {
      var iteratee = function(m) {
        return toModel(this, m);
      };

      var models = _.map(data, iteratee, this);
      var sort = !!this.$$sortFn;
      var goUp = start > 0;
      var oldLength = this.length;

      // First sort array if needed
      if (sort) {
        models.sort(this.$$sortFn);
      }
      else if (start < this.length) {
        // Otherwise, make space for new data
        shift(this, start, models.length);
      }

      var changes = [];

      var newChange = function(index, object) {
        return {
          type: 'splice',
          addedCount: 0,
          index: index,
          removed: [],
          object: object
        };
      };

      var currentChange = null;
      var oldIndex = -1;
      var size = models.length;

      for (var i = 0; i < size; ++i) {
        var model = models[i];

        // If collection is sorted, we need to keep sort, so compute
        // sorted index, and move items to make space
        // If collection is not sorted, index is already computed and
        // space is already available

        var modelIdx;
        if (sort) {
          modelIdx = this.sortedIndex(model, goUp);
          shift(this, modelIdx, 1);
        } else {
          modelIdx = start + i;
        }

        put(this, model, modelIdx);

        // Group changes
        if (!currentChange || modelIdx !== (oldIndex + 1)) {
          currentChange = newChange(modelIdx, this);
          changes.push(currentChange);
        }

        currentChange.addedCount++;
        oldIndex = modelIdx;
      }

      this.length = oldLength + size;
      this.trigger(changes);

      return this.length;
    },

    // TODO refactor and replace with a public function
    $$removeAt: function(index) {
      if (this.isEmpty()) {
        return undefined;
      }

      var oldLength = this.length;
      var lastIndex = oldLength - 1;
      var value = this[index];
      var id = this.$$key(value);

      if (index < lastIndex) {
        shift(this, index, -1);
      }

      this.length = oldLength - 1;

      unsetAt(this, lastIndex);
      unsetId(this, id);

      this.trigger({
        addedCount: 0,
        index: index,
        removed: [value],
        type: 'splice',
        object: this
      });

      return value;
    },

    // Get element at given index
    // Shortcut to array notation
    at: function(index) {
      return this[index];
    },

    // Get item by its key value
    byKey: function(key) {
      var index = this.indexByKey(key);
      return index >= 0 ? this.at(index) : undefined;
    },

    // Get index of item by its key
    indexByKey: function(key) {
      return this.$$map.contains(key) ? this.$$map.get(key) : -1;
    },

    // Returns an index in the array, if an element in the array
    // satisfies the provided testing function. Otherwise -1 is returned.
    findIndex: function(callback, ctx) {
      for (var i = 0, size = this.length; i < size; ++i) {
        if (callback.call(ctx, this.at(i), i, this)) {
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

    // Clear collection
    clear: function() {
      if (this.length > 0) {
        var array = [];
        for (var i = 0, size = this.length; i < size; ++i) {
          array[i] = this.at(i);
          unsetAt(this, i);
        }

        this.$$map.clear();
        this.length = 0;

        this.trigger({
          type: 'splice',
          removed: array,
          index: 0,
          addedCount: 0,
          object: this
        });
      }

      return this;
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
      var newArray = ArrayProto.concat.apply(this.toArray(), arguments);
      return new Constructor(newArray, {
        key: this.$$key,
        model: this.$$model
      });
    },

    // returns a shallow copy of a portion of the collection
    // into a new collection object.
    slice: function() {
      var results = callNativeArrayFn('slice', this, arguments);
      return new Constructor(results, {
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
      var array = callNativeArrayFn('sort', this, [sortFn]);
      this.$$replaceAll(array);
      this.$$sortFn = sortFn;
      return this;
    },

    // Use a binary search to compute sorted index of item
    // If collection is not sorted, it does not know how to compare
    // values, so sorted index is the default index given as second parameter.
    // If second parameter is not defined, sorted index is the last element + 1.
    sortedIndex: function(item, asc) {
      /* jshint bitwise:false */

      var high = this.length;
      var goUp = asc == null ? true : !!asc;

      if (!this.$$sortFn) {
        return goUp ? high : 0;
      }

      // Convert to model instance
      var model = item;
      if (this.$$model && !(model instanceof this.$$model)) {
        model = new this.$$model(model);
      }

      var low = 0;

      // Use binary search
      while (low < high) {
        var mid = (low + high) >>> 1;
        var current = this.at(mid);
        if (this.$$sortFn(current, model) < 0) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }

      // If low index is "equivalent" to low index, search for first
      // next or previous available index.
      var eq = false;
      if (low < this.length && (eq = this.$$sortFn(this[low], model) === 0)) {
        var inc = goUp ? 1 : -1;
        while (low && low < this.length && eq) {
          low += inc;
          eq = this.$$sortFn(this.at(low), model) === 0;
        }

        low = goUp ? low : low + 1;
      }

      return low;
    },

    // Extract property of collection items
    pluck: function(name) {
      return this.map($parse(name));
    },

    // Add new observer
    observe: function(callback, observer) {
      this.$$observers.push({
        ctx: observer || null,
        callback: callback
      });

      return this;
    },

    // Remove observer
    unobserve: function(callback, observer) {
      if (arguments.length === 0) {
        // Unobserve everything
        this.$$observers = [];
      }
      else {
        var ctx = observer || null;
        this.$$observers = _.reject(this.$$observers, function(o) {
          return o.ctx === ctx && callback === o.callback;
        });
      }

      return this;
    },

    // Trigger changes
    // Note that callbacks will be called asynchronously
    trigger: function(changes) {
      this.$$changes = this.$$changes.concat(changes);
      setTimeout(this.$$trigger);
      return this;
    },

    // Trigger changes to observers
    // Private function
    $$trigger: function() {
      if (this.$$changes.length > 0) {
        _.forEach(this.$$observers, function(o) {
          o.callback.call(o.ctx, this.$$changes);
        }, this);

        this.$$changes = [];
      }

      return this;
    }
  };

  _.forEach(['indexOf', 'size', 'lastIndexOf', 'first', 'last', 'initial', 'rest', 'partition', 'forEach', 'map', 'every', 'some', 'reduce', 'reduceRight', 'filter', 'reject', 'find', 'toArray'], function(fn) {
    if (_[fn]) {
      Constructor.prototype[fn] = function() {
        var args = [this].concat(_.toArray(arguments));
        return _[fn].apply(_, args);
      };
    }
  });

  _.forEach(['countBy', 'groupBy', 'indexBy'], function(fn) {
    Constructor.prototype[fn] = function(callback, ctx) {
      // Support nested property in collection object
      if (_.isString(callback)) {
        callback = $parse(callback);
      }

      return _[fn].call(_, this, callback, ctx);
    };
  });

  _.forEach(['toString', 'toLocaleString', 'join'], function(fn) {
    Constructor.prototype[fn] = callNativeArrayWrapper(fn);
  });

  return Constructor;
})();
