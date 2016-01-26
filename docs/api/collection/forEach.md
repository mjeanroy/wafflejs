## `forEach(callback, thisArg)`

### Usage

Executes the provided callback once for each element present in the collection in ascending order.

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```javascript
collection.forEach(function(current) {
  console.log(current);
});
```

### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

### Returns

None.

### Running Time

`O(n)`
