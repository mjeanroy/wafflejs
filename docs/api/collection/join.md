## `join(separator)`

### Usage

Joins all elements of collection into a string.

A separator can be specified to separate each element of the collection.
The separator is converted to a string if necessary.
If omitted, the elements are separated with a comma.
If separator is an empty string, all elements are joined without any characters in between them.

```javascript
// Get index of object.
var val1 = collection.join();
var val2 = collection.join(' -- ');
```

### Arguments

| Name      | Type  | Description       |
|-----------|-------|-------------------|
| separator | `*`   | Separator value.  |

### Returns

| Type       | Description                          |
|------------|--------------------------------------|
| `string`   | Elements joined as a single `string` |

### Running Time

`O(n)`
