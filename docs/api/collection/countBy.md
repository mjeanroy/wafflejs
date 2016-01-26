## `countBy(callback, thisArg)`

### Usage

Sorts a list into groups and returns a count for the number of objects in each group.
Similar to `groupBy`, but instead of returning a list of values, returns a count for the
number of values in that group.

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
// { 'john': 1, 'jane': 1 }
```

### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

### Returns

| Type       | Description       |
|------------|-------------------|
| `object`   | Object of results. |

### Running Time

`O(n)`
