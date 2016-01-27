## `size()`

### Usage

Returns the size of the collection (return `collection.length` internally).

```javascript
console.log(collection.size()); // 0

collection.push({
  id: 1
});

console.log(collection.size()); // 1
```

### Arguments

None.

### Returns

| Type       | Description             |
|------------|-------------------------|
| `number`   | Size of the collection. |

### Running Time

`O(1)`
