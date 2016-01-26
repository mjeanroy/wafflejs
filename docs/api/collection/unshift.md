## `unshift(...data)`

### Usage

Adds one or more elements to the beginning of the collection and returns the new length of the collection.
If collection is sorted, then `unshift` is equivalent to `push` (since data are inserted at the correct index).

```javascript
var data1 = {
  id: 1
};

var data2 = {
  id: 2
};

var newLength = collection.unshift(data1, data2);
console.log(newLength === collection.length); // true
```

### Arguments

| Name     | Type     | Description                                     |
|----------|----------|-------------------------------------------------|
| ...data  | `object` | Data to add at the beginning of the collection. |

### Returns

| Type       | Description |
|------------|-------------|
| `number`   | New length. |

### Running Time

`O(n)`