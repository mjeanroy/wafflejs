## `toJSON()`

### Usage

Converts a JavaScript value to a JSON `string`.

**Note:** implementation may be different, depending on the extensions. For instance, `waffle-angular` will
delegate `toJSON` method to `angular.toJson` (so, properties with leading `$$` characters will be
stripped since angular uses this notation internally).

```javascript
// Get index of object.
console.log(collection.toJSON());
```

### Arguments

None.

### Returns

| Type       | Description   |
|------------|---------------|
| `string`   | JSON `string` |

### Running Time

`O(n)`
