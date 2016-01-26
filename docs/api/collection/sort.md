## `sort(compareFunction)`

### Usage

Sort the collection.
Once sorted, the collection will remain sorted: new elements will always be added at the correct index
to maintain sort.

```javascript
// Sort collection by id
collection.sort(function(o1, o2) {
  return o1.id - o2.id;
});
```

###### Arguments

| Name            | Type       | Description                  |
|-----------------|------------|------------------------------|
| compareFunction | `function` | Define the sort order.       |

###### Returns

None.

###### Running Time

`O(n log n)`
