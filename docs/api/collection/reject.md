## `reject(predicate, thisArg)`

### Usage

Returns the values in the collection without the elements that the truth test (predicate) passes (this
is the opposite of `filter`).

Callback function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```javascript
var oddData = collection.reject(current => {
  return current.id % 2 === 0;
});
```

### Arguments

| Name      | Type       | Description                                                 |
|-----------|------------|-------------------------------------------------------------|
| predicate | `function` | Function to execute for each element.                       |
| thisArg   | `object`   | Value to use as `this` when executing predicate (optional). |

### Returns

| Type       | Description       |
|------------|-------------------|
| `array`    | Array of results. |

### Running Time

`O(n)`
