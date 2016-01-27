## `toLocaleString()`

### Usage

Returns a string representing the elements of the collection.
The elements are converted to `string` using their `toLocaleString` methods and these
`string` are separated by a locale-specific `string` (such as a comma `,`).

```javascript
// Get index of object.
var val1 = collection.toLocaleString();
```

### Arguments

None.

### Returns

| Type       | Description                          |
|------------|--------------------------------------|
| `string`   | Elements joined as a single `string` |

### Running Time

`O(n)`
