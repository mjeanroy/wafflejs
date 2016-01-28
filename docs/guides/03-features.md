# Features

## Sort & Comparator

By default, each columns will be sortable: it means that a click on the column header (or footer) will
sort data and re-render the grid in the appropriate order. Multiple ordering is supported: just click on the
column header while pressing the `ctrl` key and you're good to go.

By default, each column will be automatically sorted according to the type of values to render:
- Number values will be sorted in numerical order.
- String values will be sorted using `toLocaleCompare` function.
- Boolean values will be sorted in boolean order (`true` will be less than `false`).
- Date values will be sorted using the result of `getTime` function.

*Note:*: `null` or `undefined` values will always be less than other values.

If this is not enough, you will be able to defined custom comparator.
Suppose you want to display a list of awesome frameworks with the current stable version.
Sorting the `version` column is not easy: if you try to compare `"2.0.0"` with `"12.0.0"`, you may not get what you want.
Here is the solution using a custom comparator:

```javascript
const table = document.getElementById('waffle');
Waffle.create(table, {
  data: [
    { id: 'jquery', label: 'jQuery', version: '2.2.0' },
    { id: 'angular', label: 'Angular.JS', version: '1.4.9' },
    { id: 'react', label: 'React', version: '0.14.0' }
  ],

  columns: [
    { id: 'label' },
    { id: 'version', comparator: compareVersion }
  ]
});

function compareVersion(v1, v2) {
  const a1 = v1.split('.').map(Number);
  const a2 = v2.split('.').map(Number);

  // Compare each entry one by one and stop when
  // a discriminator value is found.
  for (let i = 0, size = a1.length; ++i) {
    if (a1[i] < a2[i]) {
      return -1;
    } else if (a[1] > a[2]) {
      return 1;
    }
  }

  return 0;
}
```

If you want to share comparators between grids, you can also add a global comparator:

```javascript
// Add a global comparator.
// The first parameter is the comparator identifier to re-use on grid.
Waffle.addComparator('version', (v1, v2) => {
  const a1 = v1.split('.').map(Number);
  const a2 = v2.split('.').map(Number);

  // Compare each entry one by one and stop when
  // a discriminator value is found.
  for (let i = 0, size = a1.length; ++i) {
    if (a1[i] < a2[i]) {
      return -1;
    } else if (a[1] > a[2]) {
      return 1;
    }
  }

  return 0;
});

const table = document.getElementById('waffle');

Waffle.create(table, {
  data: [
    { id: 'jquery', label: 'jQuery', version: '2.2.0' },
    { id: 'angular', label: 'Angular.JS', version: '1.4.9' },
    { id: 'react', label: 'React', version: '0.14.0' }
  ],

  columns: [
    { id: 'label' },
    { id: 'version', comparator: 'version' }
  ]
});
```

You can also trigger a sort programmatically: just call the `sortBy` function with the field(s) you want to sort:

```javascript
const table = document.getElementById('waffle');
const grid Waffle.create(table, {
  data: [
    { id: 'jquery', label: 'jQuery', version: '2.2.0' },
    { id: 'angular', label: 'Angular.JS', version: '1.4.9' },
    { id: 'react', label: 'React', version: '0.14.0' }
  ],

  columns: [
    { id: 'label' },
    { id: 'version', comparator: compareVersion }
  ]
});

function sort() {
  grid.sortBy(['+version', '-label']);
}
```

Two important things:
- This function accepts a string (if you want to sort on one field) or an array (if you want to sort on multiple field).
- Sort order is specified using `+` for ascending order or `-` for descending order (if not specified, default is `+`).

## Renderer

TODO

## Selection

TODO

## Edition

TODO
