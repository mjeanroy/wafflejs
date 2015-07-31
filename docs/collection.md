### Collection

#### Description

Collection is the data structure used internally to store data and columns informations. Even if you will
not be able to instantiate a collection programmatically (it's a private data structure), you will be able
to access the public api.

A collection is an array-like object. It means that you can access elements using index notation and
you can also use awesome functions from underscore or lodash.

```
var data = grid.data();

// Simple loop
for (var i = 0, length = data.length; i < length; ++i) {
  console.log(data[i]);
}

// Using underscore (or lodash)
_.forEach(data, function(current) {
  console.log(current);
});

// Using public api
data.forEach(function(current) {
  console.log(current);
});
```

To keep things fast with large collections, an internal map is maintained internally to provide efficient
data indexation. This choice has severe limitations:
- Collection store objects, not primitive values.
- Each data has to be uniquely identified.
- Data identifier is **mandatory** and **must be "serializable"**: it should be a `string` or a `number` for example (not `null` or `undefined`).

Most of the time, this is not a problem (why using a datagrid to render primitive values ?).
If it is a problem for your use case, open an issue and we will discuss it (find a workaround, or implement something new).

#### Why not using a simple array ?

For these reasons reasons:

**Provide a nice public api**

Array api is dependent to the browser and supporting features of new ES5 / ES6 standards. Using a custom
collection object, you have `forEach`, `some`, `map` `every`, etc. methods out of the box (even in IE8 !).

**Provider custom standard array api (`push`, `splice`, etc.)**

New standards `Object.observe` and `Array.observe` pattern is a really nice addition to javascript language.
Unfortunately, it is only available in Google Chrome, and we don't know when it will be supported in other browsers.
So, we decided to implement the same api within collection:
- When you push data into collection, a `splice` event is triggered.
- When you pop data into collection, a `splice` is triggered.
- And so on...

When most of the browsers will implement these feature, we will think about using native features,
but for now, it seemed to be the better compromise.

In addition to, some standards function are overrided. Once sorted, a collection remain sorted: `push` or `unshift`
operation will not necessary add the elements at the end or at the beginning.

**Performance**

Keeping an internal map allow us to retrieve data index in a very efficient way (we don't have to iterate over the entire collection).

#### Public API

##### `at(index)`

###### Usage

Get data from collection, specified by index.

```
var data0 = collection.at(0);
var data1 = collection.at(1);
```

###### Arguments

| Name  | Type     | Description                  |
|-------|----------|------------------------------|
| index | `number` | Index of data in collection. |

###### Returns

| Type       | Description                        |
|------------|------------------------------------|
|`object`    | If an object exist at given index. |
|`undefined` | If no object exist at given index. |

###### Running Time

`O(1)`

##### `indexOf(data)`

###### Usage

Returns the index at which value can be found in the collection, or -1 if
value is not present. You can also get the index of value using object identifier.

```
// Get index of object.
var idx1 = collection.at({
  id: 1
});

// Get index of object using object id.
// Assume that id is the object identifier.
var idx2 = collection.at(2);
```

###### Arguments

| Name  | Type                                 | Description                      |
|-------|--------------------------------------|----------------------------------|
| data  | `number` `string` `object` `boolean` | Data object, or data identifier. |

###### Returns

| Type       | Description                        |
|------------|------------------------------------|
| `number`   | Data index (or -1).                |

###### Running Time

`O(1)`

##### `push(...data)`

###### Usage

Add data at the end of a collection.
If collection is sorted, then this operation will push data at the appropriate index.
The new length property of the collection is returned.

```
var data1 = {
  id: 1
};

var data2 = {
  id: 2
};

var newLength = collection.push(data1, data2);
console.log(newLength === collection.length); // true
```

###### Arguments

| Name     | Type     | Description                               |
|----------|----------|-------------------------------------------|
| ...data  | `object` | Data to add at the end of the collection. |

###### Returns

| Type       | Description |
|------------|-------------|
| `number`   | New length. |

###### Running Time

`O(n)` if collection is **sorted**.
`O(1)` if collection is **not sorted**.

##### `unshift(...data)`

###### Usage

Adds one or more elements to the beginning of the collection and returns the new length of the collection.
If collection is sorted, then `unshift` is equivalent to `push` (since data are inserted at the correct index).

```
var data1 = {
  id: 1
};

var data2 = {
  id: 2
};

var newLength = collection.unshift(data1, data2);
console.log(newLength === collection.length); // true
```

###### Arguments

| Name     | Type     | Description                                     |
|----------|----------|-------------------------------------------------|
| ...data  | `object` | Data to add at the beginning of the collection. |

###### Returns

| Type       | Description |
|------------|-------------|
| `number`   | New length. |

###### Running Time

`O(n)`

##### `pop()`

###### Usage

Removes the last element from the collection and returns that element.
If you call `pop()` on an empty collection, it returns an `undefined` value.

```
var last = collection.pop();
```

###### Arguments

None.

###### Returns

| Type       | Description      |
|------------|------------------|
| `object`   | Removed element. |

###### Running Time

`O(1)`

##### `shift()`

###### Usage

Removes the first element from the collection and returns that element.
If you call `shift()` on an empty collection, it returns an `undefined` value.

```
var first = collection.shift();
```

###### Arguments

None.

###### Returns

| Type       | Description      |
|------------|------------------|
| `object`   | Removed element. |

###### Running Time

`O(n)`

##### `splice(startFrom, deleteCount, ...data)`

###### Usage

Changes the content of the collection by removing existing elements and/or adding new elements.
An array (not a collection) containing the deleted elements is returned.
If collection is sorted, new elements will be added at the correct index to maintain order.

```
// Remove elements
var removed1 = collection.splice(0, 5);

// Remove and add elements
var data1 = {
  id: 1
};

var data2 = {
  id: 2
};

var removed2 = collection.splice(0, 1, data1, data2);
```

###### Arguments

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| startFrom   | `number` | Index at which to start changing the collection. |
| deleteCount | `number` | Number of elements to remove.                    |
| ...data     | `object` | Element to add to the collection (optional).     |

###### Returns

| Type       | Description       |
|------------|-------------------|
| `array`    | Removed elements. |

###### Running Time

`O(n)`

##### `sort(compareFunction)`

###### Usage

Sort the collection.
Once sorted, the collection will remain sorted: new elements will always be added at the correct index
to maintain sort.

```
// Sort collection by id
collection.sort(function(o1, o2) {
  return o1.id - o2.id;
});
```

###### Arguments

| Name            | Type       | Description                  |
|-----------------|------------|------------------------------|
| compareFunction | `function` | Define the sort order.       |

###### Returns

None.

###### Running Time

`O(n log n)`

##### `reverse()`

###### Usage

Reverses the collection in place.
The first array element becomes the last and the last becomes the first.

```
// Remove collection
collection.reverse();
```

###### Arguments

None.

###### Returns

None.

###### Running Time

`O(n)`

##### `forEach(callback, thisArg)`

###### Usage

Executes the provided callback once for each element present in the collection in ascending order.

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```
collection.forEach(function(current) {
  console.log(current);
});
```

###### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

###### Returns

None.

###### Running Time

`O(n)`

##### `map(callback, thisArg)`

###### Usage

Executes the provided callback once for each element present in the collection in ascending order and constructs
a new array from the results.

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```
var arrayOfId = collection.map(function(current) {
  return current.id;
});
```

###### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

###### Returns

| Type       | Description       |
|------------|-------------------|
| `array`    | Array of results. |

###### Running Time

`O(n)`

##### `filter(callback, thisArg)`

###### Usage

Executes the provided callback once for each element present in the collection in ascending order and
constructs a new array of all the values for which callback returns a truthy value.

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```
var evenData = collection.filter(function(current) {
  return current.id % 2 === 0;
});
```

###### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

###### Returns

| Type       | Description       |
|------------|-------------------|
| `array`    | Array of results. |

###### Running Time

`O(n)`

##### `find(callback, thisArg)`

###### Usage

Executes the callback function once for each element present in the array until it finds one
where callback returns a `true` value.
If such an element is found, find immediately returns the value of that element.
Otherwise, find returns `undefined`.

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```
var data1 = collection.find(function(current) {
  return current.id === 1;
});
```

###### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

###### Returns

| Type        | Description            |
|-------------|------------------------|
| `object`    | Found result.          |
| `undefined` | If no result is found. |

###### Running Time

`O(n)`

##### `findIndex(callback, thisArg)`

###### Usage

Executes the callback function once for each element present in the array
until it finds one where callback returns a `true` value.
If such an element is found, `findIndex` immediately returns the index of that element.
Otherwise, findIndex returns -1.

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```
var data1Index = collection.findIndex(function(current) {
  return current.id === 1;
});
```

###### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

###### Returns

| Type        | Description            |
|-------------|------------------------|
| `number`    | Index of found result. |

###### Running Time

`O(n)`
