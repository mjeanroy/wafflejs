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
/* global $util */
/* global $json */
/* global HashMap */
/* global Observable */
/* global Change */
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
 */

const Collection = (() => {

  const ArrayProto = Array.prototype;
  const keepNativeArray = (() => {
    try {
      const obj = {};
      obj[0] = 1;
      return !!ArrayProto.toLocaleString.call(obj);
    } catch (error) {
      return false;
    }
  })();

  const callNativeArrayWrapper = fn => {
    return function() {
      // Some browsers, including phantomjs 1.x need a real array
      // to be called as the context of Array prototype function (array like
      // object are not permitted)
      // Newer browsers does not need this, so keep it fast for them !
      const array = keepNativeArray ? this : _.toArray(this);
      return ArrayProto[fn].apply(array, arguments);
    };
  };

  const callNativeArrayFn = (fn, ctx, args) => callNativeArrayWrapper(fn).apply(ctx, args);

  // == Private functions

  // To Int function
  // See: http://es5.github.io/#x9.4
  const toInt = nb => parseInt(Number(nb) || 0, 10);

  // Save bytes
  const createSplice = Change.createSplice;
  const createUpdate = Change.createUpdate;

  // Unset data at given index.
  const unsetAt = (collection, idx) => delete collection[idx];

  // Unset id entry in internal map of object index.
  const unsetId = (collection, id) => collection.$$map.remove(id);

  // Unset data from collection
  const unset = (collection, obj) => {
    const id = collection.$$key(obj);
    const ctx = collection.$$map.get(id);
    const idx = ctx ? ctx.idx : null;
    if (idx != null) {
      unsetAt(collection, idx);
      unsetId(collection, id);
    }
  };

  const throwError = message => {
    throw Error(message);
  };

  // Convert parameter to a model instance.
  const parseModel = (collection, o) => {
    if (!_.isObject(o)) {
      // Only object are allowed inside collection
      throwError('Waffle collections are not array, only object are allowed');
    }

    let result;

    if (o instanceof collection.$$model) {
      // It is already an instance of model object !
      result = o;
    } else {
      // Create new model instance and return it.
      result = new collection.$$model(o);
    }

    // Try to get model identitifer
    const id = collection.$$key(result);
    if (id == null) {
      throwError('Collection elements must have an id, you probably missed to specify the id key on initialization ?');
    }

    return result;
  };

  // Iteratee to use to transform object to models
  // Should be used with _.map iteration
  const parseModelIteratee = function(o) {
    return parseModel(this, o);
  };

  // Add entry at given index.
  // Internal map is updated to keep track of indexes.
  const put = function(collection, o, i, id) {
    collection[i] = o;

    if (o != null) {
      const ngArgs = arguments.length;
      const dataId = ngArgs === 3 ? collection.$$key(o) : id;
      const dataCtx = collection.$$map.get(dataId) || {};
      dataCtx.idx = i;
      collection.$$map.put(dataId, dataCtx);
    }

    return o;
  };

  // Swap elements at given index
  // Internal map is updated to keep track of indexes.
  const swap = (collection, i, j) => {
    const oj = collection.at(j);
    const oi = collection.at(i);
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
  const shiftRight = (collection, start, size) => {
    const absSize = Math.abs(size);

    // Swap elements index by index
    for (let i = collection.length - 1; i >= start; --i) {
      swap(collection, i, i + absSize);
    }

    collection.length += absSize;
  };

  // Move all elements of collection to the left.
  // Start index is specified by first parameter.
  // Number of move is specified by second parameter.
  // Size of collection is automatically updated.
  // Removed elements are returned
  // Exemple:
  //   shiftLeft([0, 1, 2], 0, 2) => [2]
  //   shiftLeft([0, 1, 2], 1, 1) => [0, 2]
  //   shiftLeft([0, 1, 2], 2, 1) => [0, 1]
  const shiftLeft = (collection, start, size) => {
    const absSize = Math.abs(size);
    const oldLength = collection.length;
    const newLength = oldLength - absSize;
    const max = start + absSize;

    const removed = [];

    // Swap elements index by index
    for (let i = max; i < oldLength; ++i) {
      swap(collection, i, i - absSize);
    }

    // Clean last elements of array
    for (let k = newLength; k < oldLength; ++k) {
      let o = collection.at(k);
      removed.unshift(o);
      unset(collection, o);
    }

    collection.length = newLength;

    return removed;
  };

  const merge = (collection, array) => {
    const sortFn = collection.$$sortFn;
    const sizeCollection = collection.length;
    const sizeArray = array.length;
    const newSize = sizeCollection + sizeArray;

    const changes = [];

    let change;
    let j = sizeCollection - 1;
    let k = sizeArray - 1;

    for (let i = newSize - 1; i >= 0; --i) {
      if (j < 0 || sortFn(collection[j], array[k]) < 0) {
        const addedElement = put(collection, array[k--], i);

        // New change occurs
        change = _.first(changes);
        if (!change || change.index !== (i + 1)) {
          change = createSplice([], [addedElement], i, collection);
          changes.unshift(change);
        } else {
          change.index = i;
          change.addedCount++;
          change.added.unshift(addedElement);
        }

        if (k < 0) {
          // Array is 100% merged
          break;
        }
      } else {
        put(collection, collection[j--], i);
      }
    }

    // Update collection length
    collection.length = newSize;

    return changes;
  };

  const isSorted = (collection, model, idx) => {
    const length = collection.length;
    const sortFn = collection.$$sortFn;

    const previous = idx > 0 ? collection[idx - 1] : null;
    if (previous != null && sortFn(previous, model) > 0) {
      return false;
    }

    const next = idx < length ? collection[idx + 1] : null;
    if (next != null && sortFn(model, next) > 0) {
      return false;
    }

    return true;
  };

  class Collection {
    constructor(data, options) {
      const opts = options || {};

      // We keep an internal map that will store, for each data, an additionnal context
      // object that can be used to keep various information (index in collection,
      // internal state of data etc.).
      // Each entry is indexed by data identifier (value retrieved from $$key).
      this.$$map = new HashMap();

      // Internal data model object.
      // Use Object as a fallback since every object is already an instance of Object !
      this.$$model = opts.model || Object;

      // Key may be an attribute name or an explicit function
      this.$$key = opts.key || 'id';
      if (!_.isFunction(this.$$key)) {
        this.$$key = $parse(this.$$key);
      }

      // Initialize collection
      this.length = 0;
      if (data && data.length) {
        this.push.apply(this, data);
      }
    }

    // Get collection options
    options() {
      return {
        model: this.$$model,
        key: this.$$key
      };
    }

    // Get element at given index
    // Shortcut to array notation
    at(index) {
      return this[index];
    }

    // Get item by its key value
    byKey(key) {
      const index = this.indexOf(key);
      return index >= 0 ? this.at(index) : undefined;
    }

    // Get current context of given data.
    ctx(o) {
      const key = _.isObject(o) ? this.$$key(o) : o;
      return this.$$map.contains(key) ? this.$$map.get(key) : null;
    }

    // Get index of data in collection.
    // This function use internal id to check index faster.
    // This function accept data or data identifier as argument.
    indexOf(o) {
      const ctx = this.ctx(o);
      return ctx ? ctx.idx : -1;
    }

    // Check if data object is already inside collection.
    // This function is a shortcut for checking return value of indexOf.
    // This function accept data or data identifier as argument.
    contains(o) {
      return this.indexOf(o) >= 0;
    }

    // Returns an index in the array, if an element in the array
    // satisfies the provided testing function. Otherwise -1 is returned.
    findIndex(callback, ctx) {
      for (let i = 0, size = this.length; i < size; ++i) {
        if (callback.call(ctx, this.at(i), i, this)) {
          return i;
        }
      }
      return -1;
    }

    // Replace data in collection.
    // Data with same id will be replaced by data in parameter.
    replace(data) {
      const model = parseModel(this, data);
      const idx = this.indexOf(model);

      // If data does not exist, then it should fail as soon as possible.
      if (idx < 0) {
        throwError('Data to replace is not in collection !');
      }

      // If collection is sorted, data may have to be put at
      // a different index.
      const length = this.length;
      const sortFn = this.$$sortFn;

      if (sortFn && length > 1 && !isSorted(this, model, idx)) {
        this.remove(model);
        this.push(model);
      } else {
        this[idx] = model;
        this.notifyUpdate(idx);
      }

      return this;
    }

    // Add new elements at given index
    // This is a shortcut for splice(start, O, models...)
    add(models, start) {
      const startIdx = start == null ? this.length : start;
      const args = [startIdx, 0].concat(models);
      this.splice.apply(this, args);
      return this.length;
    }

    // Remove elements of collection
    // If first argument is:
    // - A number, then this is a shortcut for splice(start, deleteCount).
    // - An array, then all items in array are removed.
    // - An object, then this item is removed.
    // - Otherwise, this should be a predicate. This predicate will be called for
    //   each element, and must return a truthy value to remove that element.
    remove(start, deleteCount) {
      // If first argument is a number, then this is a shortcut for splice method.
      if (_.isNumber(start)) {
        return this.splice.call(this, start, deleteCount || this.length);
      }

      // If it is an array, then remove everything in array.
      if (_.isArray(start)) {
        const $key = this.$$key;
        const map = _.indexBy(start, o => $key(o));
        return this.remove(current => !!map[$key(current)]);
      }

      // If it is an object, then remove single item.
      if (_.isObject(start) && !_.isFunction(start)) {
        const model = parseModel(this, start);
        const index = this.indexOf(model);
        return index >= 0 ? this.remove(index, 1) : [];
      }

      const predicate = start;
      const ctx =  deleteCount;

      let idx = 0;
      let lastChangeIdx = null;

      const changes = [];
      const removed = [];

      for (let i = 0, size = this.length; i < size; ++i) {
        const o = this.at(i);
        const id = this.$$key(o);

        if (predicate.call(ctx, o, i)) {
          // Remove
          unsetAt(this, i);
          unsetId(this, id);

          // Merge with last change or create new change object
          if (lastChangeIdx === (i - 1)) {
            _.last(changes).removed.push(o);
          } else {
            changes.push(createSplice([o], [], i, this));
          }

          removed.push(o);
          lastChangeIdx = i;
        } else {
          // Keep
          if (idx !== i) {
            unsetAt(this, i);
            unsetId(this, id);
            put(this, o, idx, id);
          }

          idx++;
        }
      }

      // Update collection length
      this.length -= removed.length;

      if (changes.length > 0) {
        this.notify(changes);
      }

      return removed;
    }

    // Force an update change.
    // This will force a row update.
    notifyUpdate(idx) {
      return this.notify([createUpdate(idx, this)]);
    }

    // Adds one or more elements to the end of the collection
    // and returns the new length of the collection.
    // Semantic is the same as [].push function
    push() {
      return this.add.call(this, _.toArray(arguments));
    }

    // adds one or more elements to the beginning of the collection
    // and returns the new length of the collection.
    // Semantic is the same as [].unshift function
    unshift() {
      return this.add.call(this, _.toArray(arguments), 0);
    }

    // Removes the last element from the collection
    // and returns that element.
    pop() {
      return this.remove(this.length - 1, 1)[0];
    }

    // removes the first element from the collection
    // and returns that element.
    shift() {
      return this.remove(0, 1)[0];
    }

    // Toggle data :
    // - If data is already in collection, it will be removed
    // - Otherwise it will be pushed into the collection
    toggle(data) {
      const index = this.indexOf(data);

      if (index >= 0) {
        return this.remove(index, 1);
      } else {
        return this.push(data);
      }
    }

    // Clear collection
    clear() {
      if (this.length > 0) {
        const array = [];
        for (let i = 0, size = this.length; i < size; ++i) {
          array[i] = this.at(i);
          unsetAt(this, i);
        }

        this.$$map.clear();
        this.length = 0;
        this.notify(createSplice(array, [], 0, this));
      }

      return this;
    }

    // Reset entire collection with new data array
    reset(array) {
      const oldSize = this.length;
      const newSize = array.length;

      // Transform models before anything else
      const models = _.map(array, parseModelIteratee, this);

      const sortFn = this.$$sortFn;
      if (sortFn) {
        models.sort(sortFn);
      }

      this.$$map.clear();

      const removed = [];

      let i = 0;

      for (i = 0; i < newSize; ++i) {
        if (i < oldSize) {
          removed.push(this.at(i));
        }

        put(this, models[i], i);
      }

      for (; i < oldSize; ++i) {
        removed.push(this.at(i));
        unsetAt(this, i);
      }

      this.length = newSize;

      this.notify([
        createSplice(removed, models, 0, this)
      ]);

      return this;
    }

    // Check if collection is empty
    isEmpty() {
      return this.length === 0;
    }

    // Returns a new collection comprised of the collection on which it is called
    // joined with the collection(s) and/or value(s) provided as arguments.
    concat() {
      const newArray = ArrayProto.concat.apply(this.toArray(), arguments);
      return new Collection(newArray, this.options());
    }

    // returns a shallow copy of a portion of the collection
    // into a new collection object.
    slice() {
      const results = callNativeArrayFn('slice', this, arguments);
      return new Collection(results, this.options());
    }

    // Changes the content of the collection by removing existing
    // elements and/or adding new elements.
    // If collection is sorted, splice will insert new elements
    // in order (collection remains sorted).
    splice(start, deleteCount) {
      const sortFn = this.$$sortFn;
      const size = this.length;
      const data = _.rest(arguments, 2);

      // Data to model transformation.
      // This iteration will also check for undefined / null values.
      const models = _.map(data, parseModelIteratee, this);

      // Index at which to start changing the array.
      // If greater than the length of the array, actual starting index will
      // be set to the length of the array.
      // If negative, will begin that many elements from the end.
      // See: http://es5.github.io/#x15.4.4.10
      let actualStart = toInt(start);
      if (actualStart >= 0) {
        actualStart = Math.min(size, actualStart);
      } else {
        actualStart = Math.max(size + actualStart, 0);
      }

      // An integer indicating the number of old array elements to remove.
      // If deleteCount is 0, no elements are removed.
      // In this case, you should specify at least one new element.
      // If deleteCount is greater than the number of elements left in the array
      // starting at start, then all of the elements through the end of
      // the array will be deleted.
      // See: http://es5.github.io/#x15.4.4.10
      const actualDeleteCount = Math.min(Math.max(toInt(deleteCount) || 0, 0), size - actualStart);

      // Track removed elements
      const removed = [];

      // First delete elements
      if (actualDeleteCount > 0) {
        for (let i = 0; i < actualDeleteCount; ++i) {
          removed.push(this[i + actualStart]);
        }

        shiftLeft(this, actualStart, actualDeleteCount);
      }

      let changes;

      // We need to split between existing data and new data to add.
      const parts = _.groupBy(models, this.contains, this);
      const existing = parts[true] || [];
      const added = parts[false] || [];
      const addedCount = added.length;
      const existingCount = existing.length;

      // Add new elements
      if (addedCount > 0) {
        if (sortFn) {
          // We need to keep sort: sort added elements and merge everything
          added.sort(sortFn);
          changes = merge(this, added);
        } else {
          // Shift and put elements at given indexes
          shiftRight(this, actualStart, addedCount);

          for (let k = 0; k < addedCount; ++k) {
            put(this, added[k], actualStart + k);
          }

          changes = [createSplice(removed, added, actualStart, this)];
        }
      } else {
        changes = [];
      }

      // Add change for removed elements
      if (removed.length > 0) {
        const change = _.find(changes, c => c.index === actualStart);

        if (change) {
          // Merge change for removed elements with added elements changes
          change.removed = removed;
        } else {
          // Prepend changes with change for removed elements
          changes.unshift(createSplice(removed, [], actualStart, this));
        }
      }

      // Trigger splice changes
      if (changes.length > 0) {
        this.notify(changes);
      }

      // Replace existing data and trigger changes
      if (existingCount > 0) {
        if (sortFn) {
          existing.sort(sortFn);
        }

        for (let x = 0; x < existingCount; ++x) {
          this.replace(existing[x]);
        }
      }

      // An array containing the deleted elements.
      // If only one element is removed, an array of one element is returned.
      // If no elements are removed, an empty array is returned.
      return removed;
    }

    // Reverses collection in place.
    // The first array element becomes the last and the last becomes the first.
    reverse() {
      if (this.$$sortFn) {
        // If collection is sorted, reverse is a no-op
        return this;
      }

      const size = this.length;
      const mid = Math.floor(size / 2);

      // Track changes using two arrays to have changes in order
      const changesStart = [];
      const changesEnd = [];

      for (let i = 0, j = size - 1; i < mid; ++i, --j) {
        swap(this, i, j);
        changesStart.push(createUpdate(i, this));
        changesEnd.unshift(createUpdate(j, this));
      }

      // Trigger changes in order
      const changes = changesStart.concat(changesEnd);
      if (changes.length) {
        this.notify(changes);
      }

      return this;
    }

    // Split collection into smaller arrays
    // Returned value is an array of smaller arrays.
    split(size) {
      return $util.split(this, size);
    }

    // Custom json representation
    // Need JSON.stringify to be available
    toJSON() {
      return $json.toJson(this.toArray());
    }

    // Sort given collection in place
    // Sorted collection is returned
    sort(sortFn) {
      this.$$sortFn = sortFn;
      return this.reset(this.toArray())
                 .clearChanges();
    }

    // Extract property of collection items
    pluck(name) {
      const getter = $parse(name);
      return this.map(o => getter(o));
    }
  }

  // Since collection should only contains uniq elements, indexOf and lastIndexOf should
  // be the same.
  Collection.prototype.lastIndexOf = Collection.prototype.indexOf;

  // Turn collection to an observable object
  _.extend(Collection.prototype, Observable);

  // Add underscore functions to Collection prototype
  const underscoreMethods = [
    'size',
    'first',
    'last',
    'initial',
    'rest',
    'partition',
    'forEach',
    'map',
    'every',
    'some',
    'reduce',
    'reduceRight',
    'filter',
    'reject',
    'find',
    'toArray'
  ];

  _.forEach(underscoreMethods, fn => {
    if (_[fn]) {
      Collection.prototype[fn] = function() {
        const args = [this].concat(_.toArray(arguments));
        return _[fn].apply(_, args);
      };
    }
  });

  // These functions may allow nested properties
  _.forEach(['countBy', 'groupBy', 'indexBy'], fn => {
    Collection.prototype[fn] = function(callback, ctx) {
      // Support nested property in collection object
      if (_.isString(callback)) {
        const getter = $parse(callback);
        callback = o => getter(o);
      }

      return _[fn].call(_, this, callback, ctx);
    };
  });

  // Add some Array functions to Collection prototype
  _.forEach(['toString', 'toLocaleString', 'join'], fn => {
    Collection.prototype[fn] = callNativeArrayWrapper(fn);
  });

  return Collection;
})();
