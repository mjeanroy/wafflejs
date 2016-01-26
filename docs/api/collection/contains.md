## `contains(value)`

### Usage

Returns `true` if value is in the collection, `false` otherwise.
This method use `indexOf` internally.

```javascript
// Check if object is in the collection.
var contains = collection.contains({
  id: 1
});

// Check if an object with identifier `2` is in the collection.
var contains = collection.contains(2);
```

### Arguments

| Name  | Type                                 | Description                      |
|-------|--------------------------------------|----------------------------------|
| data  | `number` `string` `object` `boolean` | Data object, or data identifier. |

### Returns

| Type       | Description                        |
|------------|------------------------------------|
| `number`   | Data index (or -1).                |

### Running Time

`O(1)`

### Running Time

`O(1)`
