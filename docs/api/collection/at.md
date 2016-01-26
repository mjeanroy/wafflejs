## `at(index)`

### Usage

Get data from collection, specified by index.

```javascript
var data0 = collection.at(0);
var data1 = collection.at(1);
```

### Arguments

| Name  | Type     | Description                  |
|-------|----------|------------------------------|
| index | `number` | Index of data in collection. |

### Returns

| Type       | Description                        |
|------------|------------------------------------|
|`object`    | If an object exist at given index. |
|`undefined` | If no object exist at given index. |

### Running Time

`O(1)`
