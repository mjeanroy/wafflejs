## `split(size)`

### Usage

Split the collection into smaller arrays:
- Each arrays will have a size less than or equals to `size`.
- The last array may have a size lower than the `size` value.

```javascript
var pages = collection.split(10);
console.log(pages);
```

### Arguments

| Name   | Type     | Description     |
|--------|----------|-----------------|
| size   | `number` | Size of arrays. |

### Returns

| Type           | Description      |
|----------------|------------------|
| `array<array>` | Array of arrays. |

### Running Time

`O(n)`
