## `push(...data)`

### Usage

Add data at the end of a collection:
- If collection is sorted, then this operation will push data at the appropriate index.
- If data is already in the collection, then this function is a no-op.

The new length property of the collection is returned.

```javascript
var data1 = {
  id: 1
};

var data2 = {
  id: 2
};

var newLength = collection.push(data1, data2);
console.log(newLength === collection.length); // true
```

### Arguments

| Name     | Type     | Description                               |
|----------|----------|-------------------------------------------|
| ...data  | `object` | Data to add at the end of the collection. |

### Returns

| Type       | Description |
|------------|-------------|
| `number`   | New length. |

### Running Time

`O(n)` if collection is **sorted**.
`O(1)` if collection is **not sorted**.