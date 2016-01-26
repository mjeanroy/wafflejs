## `every(predicate, thisArg)`

### Usage

Returns `true` if all of the values in the collection pass the predicate truth test.

Predicate function is invoked with three arguments:
- the element value.
- the element index.
- the collection being traversed.

If a `thisArg` parameter is provided, it will be passed to predicate when invoked, for use as its `this` value.

```javascript
var admin = collection.countBy(current => current.admin);
```

### Arguments

| Name      | Type       | Description                                                |
|-----------|------------|------------------------------------------------------------|
| predicate | `function` | Predicate to execute for each element.                     |
| thisArg   | `object`   | Value to use as `this` when executing callback (optional). |

### Returns

| Type       | Description                                                                              |
|------------|------------------------------------------------------------------------------------------|
| `boolean`  | `true` if predicate returns a truthy value for the entire collection, `false` otherwise. |

### Running Time

`O(n)`
