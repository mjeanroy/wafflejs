## `first(n)`

### Usage

Returns the last element of an array. Passing n will return the last n elements of the array.

```javascript
var last = collection.last();
var last10 = collection.last(10);
```

### Arguments

| Name     | Type     | Description                                                              |
|----------|----------|--------------------------------------------------------------------------|
| n        | `number` | Value to use to return the lasr `n` elements (optional, default is `1`). |

### Returns

| Type        | Description                                                                                        |
|-------------|----------------------------------------------------------------------------------------------------|
| `object`    | Last element in collection (when `n` === 1).                                                       |
| `array`     | Last `n` elements in collection (when `n` > 1). If collection is empty, an empty array is returned |
| `undefined` | When collection is empty and `n === 1`.                                                            |

### Running Time

`O(n)` (where `n` is the parameter value).
