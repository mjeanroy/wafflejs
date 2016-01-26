## `findIndex(callback, thisArg)`

### Usage

Executes the callback function once for each element present in the array
until it finds one where callback returns a `true` value.
If such an element is found, `findIndex` immediately returns the index of that element.
Otherwise, findIndex returns -1.

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```javascript
var data1Index = collection.findIndex(current => {
  return current.id === 1;
});
```

### Arguments

| Name     | Type       | Description                                                |
|----------|------------|------------------------------------------------------------|
| callback | `function` | Function to execute for each element.                      |
| thisArg  | `object`   | Value to use as `this` when executing callback (optional). |

### Returns

| Type        | Description            |
|-------------|------------------------|
| `number`    | Index of found result. |

### Running Time

`O(n)`
