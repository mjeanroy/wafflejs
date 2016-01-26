## `first(n)`

### Usage

Returns the first element of the collection. Passing `n` will return the first n elements of the collection.

```javascript
var first = collection.first();
var first10 = collection.first(10);
```

### Arguments

| Name     | Type     | Description                                                               |
|----------|----------|---------------------------------------------------------------------------|
| n        | `number` | Value to use to return the first `n` elements (optional, default is `1`). |

### Returns

| Type        | Description                                                                                         |
|-------------|-----------------------------------------------------------------------------------------------------|
| `object`    | First element in collection (when `n` === 1).                                                       |
| `array`     | First `n` elements in collection (when `n` > 1). If collection is empty, an empty array is returned |
| `undefined` | When collection is empty and `n === 1`.                                                             |

### Running Time

`O(n)` (where `n` is the parameter value).
