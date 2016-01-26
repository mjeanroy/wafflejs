## `indexOf(data)`

### Usage

Returns the index at which value can be found in the collection, or -1 if
value is not present. You can also get the index of value using object identifier.

```javascript
// Get index of object.
var idx1 = collection.indexOf({
  id: 1
});

// Get index of object using object id.
// Assume that id is the object identifier.
var idx2 = collection.indexOf(2);
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
