## `filter(callback, thisArg)`

### Usage

Executes the provided callback once for each element present in the collection in ascending order and
constructs a new array of all the values for which callback returns a truthy value.

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```javascript
var evenData = collection.filter(current => {
  return current.id % 2 === 0;
});
```

### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

### Returns

| Type       | Description       |
|------------|-------------------|
| `array`    | Array of results. |

### Running Time

`O(n)`
