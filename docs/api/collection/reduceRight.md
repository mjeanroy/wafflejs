## `reduceRight(callback, initialValue, thisArg)`

### Usage

applies a function against an accumulator and each value of the collection (from right-to-left)
to reduce it to a single value.

Callback function is invoked with four arguments:
- the value previously returned in the last invocation of the callback, or `initialValue`, if supplied.
- the element value.
- the element index.
- the collection being traversed.

The first time the callback is called:
- if `initialValue` is provided in the call to reduce, then the accumulator value will be equal to `initialValue`.
- if no `initialValue` was provided, then the accumulator value will be equal to the last value in the collection.

If a `thisArg` parameter is provided, it will be passed to callback when invoked, for use as its `this` value.

```javascript
var sum = collection.reduceRight((acc, current) => acc + current.val, 0);
```

### Arguments

| Name         | Type       | Description                                                |
|--------------|------------|------------------------------------------------------------|
| callback     | `function` | Function to execute for each element.                      |
| initialValue | `*`        | Initial value of the accumulator (optional).               |
| thisArg      | `object`   | Value to use as `this` when executing callback (optional). |

### Returns

| Type       | Description                        |
|------------|------------------------------------|
| `*`        | The last value of the accumulator. |

### Running Time

`O(n)`
