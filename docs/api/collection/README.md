# Collection

## Description

Collection is the data structure used internally to store data and columns informations
Even if you will not be able to instantiate a collection programmatically (it's a private data structure),
you will be able to access the public api.

A collection is an array-like object. It means that you can access elements using index notation and
you can also use functions from underscore or lodash.

```javascript
var data = grid.data();

// Using a simple loop
for (var i = 0, length = data.length; i < length; ++i) {
  console.log(data[i]);
}

// Using underscore (or lodash)
_.forEach(data, current => {
  console.log(current);
});

// Using public api
data.forEach(current => {
  console.log(current);
});
```

To keep things fast with large collections, an internal map is maintained internally to provide
efficient data indexation. This choice has severe limitations:
- Collection can only store objects, not primitive values.
- Each data has to be uniquely identified.
- Data identifier is **mandatory** and **must be "serializable"**: it should be a `string` or a `number` for example (not `null` or `undefined`).

Most of the time, this is not a problem (why using a datagrid to render primitive values ?).
If it is a problem for your use case, open an issue and we will discuss it (find a workaround, or implement something new).

## Why not using a simple array ?

For several reasons:

**Provide a nice public api**

Array api is dependent to the browser and supporting features of new ES5 / ES6 standards is hard.
Using a custom collection object, you have `forEach`, `some`, `map` `every`, etc. methods for free, even in IE8 !

**Provider custom standard array api (`push`, `splice`, etc.)**

To make things fast, collection triggers some events to let anyone knows that something happens (when a new
data is added or removed, etc.).

In addition to, some standards function are overrided:
- Once sorted, a collection remain sorted (it means that `push` or `unshift` operation will not necessary add the elements at the end or at the beginning).
- Duplications are not allowed: `push` operation will not push data to the collection if it is already present.

**Performance**

Keeping an internal map allow us to retrieve data index in a very efficient way (we don't have to always iterate over the entire collection).
