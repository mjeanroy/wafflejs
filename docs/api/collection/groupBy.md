## `groupBy(callback, thisArg)`

### Usage

Splits a collection into sets, grouped by the result of running each value through `callback`.
If `callback` is a `string` instead of a function, groups by the property named by `callback`
on each of the values (support deep property).

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```javascript
var counters = collection.countBy(current => {
  return current.name;
});

console.log(counters);
// { "john": [{"id": 1, "name": "john"}], "jane": [{"id": 1, "name": "jane"}] }
```

### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
|          | `string`   | Property to extract on each element.                       |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

### Returns

| Type       | Description       |
|------------|-------------------|
| `object`   | Object of results. |

### Running Time

`O(n)`
