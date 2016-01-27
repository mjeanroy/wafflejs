## `pluck(propertyName)`

### Usage

Extract list of property value for each elements in the collection.

```javascript
console.log(collection.pluck('id'));

// Equivalent using map:
console.log(collection.map(x => x.id));
```

### Arguments

| Name         | Type       | Description                                            |
|--------------|------------|--------------------------------------------------------|
| propertyName | `string` | Name of the property to extract (support deep property). |

### Returns

| Type       | Description      |
|------------|------------------|
| `array`    | Array of values. |

### Running Time

`O(n)`
