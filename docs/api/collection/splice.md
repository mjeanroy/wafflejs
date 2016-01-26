## `splice(startFrom, deleteCount, ...data)`

### Usage

Changes the content of the collection by removing existing elements and/or adding new elements.
An array (not a collection) containing the deleted elements is returned.
If collection is sorted, new elements will be added at the correct index to maintain order.

```javascript
// Remove elements
var removed1 = collection.splice(0, 5);

// Remove and add elements
var data1 = {
  id: 1
};

var data2 = {
  id: 2
};

var removed2 = collection.splice(0, 1, data1, data2);
```

### Arguments

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| startFrom   | `number` | Index at which to start changing the collection. |
| deleteCount | `number` | Number of elements to remove.                    |
| ...data     | `object` | Element to add to the collection (optional).     |

### Returns

| Type       | Description       |
|------------|-------------------|
| `array`    | Removed elements. |

### Running Time

`O(n)`
