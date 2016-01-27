## `partition(predicate)`

### Usage

Split collection into two arrays:
- one whose elements all satisfy predicate,
- one whose elements all do not satisfy predicate.

```javascript
var partitions = collection.partition(data => data.id % 2 === 0);
```

### Arguments

None.

### Returns

| Type        | Description                                  |
|-------------|----------------------------------------------|
| `predicate` | Predicate function applied on each elements. |

### Running Time

`O(n)`
