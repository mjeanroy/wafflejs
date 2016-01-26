## `indexBy(callback, thisArg)`

### Usage

Returns an object with an index of each item.
Just like `groupBy`, but for when you know your keys are unique.

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
// { "jane": [{"id": 1, "name": "jane"}] }
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
