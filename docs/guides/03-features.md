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
Waffle.create(document.getElementById('waffle'), {
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

Waffle.create(document.getElementById('waffle'), {
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
Waffle.create(document.getElementById('waffle'), {
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

By default, Waffle will render each cell using the value of the current object attribute (current object is the object rendered in a row).
This should be enough, say 70% of time, but you can customize the way a cell is rendered.

Suppose you want to want to display uppercased or capitalized values in a cell:

```javascript
Waffle.create(document.getElementById('waffle'), {
  data: [
    { id: 1, firstName: 'john', lastName: 'doe' },
    { id: 2, firstName: 'jane', lastName: 'doe' },
  ],

  columns: [
    { id: 'firstName', renderer: capitalize },
    { id: 'lastName', renderer: uppercase }
  ]
});

function uppercase(v) {
  return v.toUpperCase();
}

function capitalize(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}
```

You can also chain renderers (the result of the previous renderer will given as the parameter of the next renderer).
Here is an example if you want to be sure `null` or `undefined` values are rendered as an empty string:

```javascript
Waffle.create(document.getElementById('waffle'), {
  data: [
    { id: 1, firstName: 'john', lastName: 'doe' },
    { id: 2, firstName: 'jane', lastName: 'doe' },
  ],

  columns: [
    { id: 'firstName', renderer: [nullSafe, capitalize] },
    { id: 'lastName', renderer: [nullSafe, uppercase] }
  ]
});

function nullSafe(v) {
  return v == null ? '' : v;
}

function uppercase(v) {
  return v.toUpperCase();
}

function capitalize(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}
```

As with comparators, you can define global renderers to share accross grids:

```javascript
Waffle.addRenderer('capitalize', function (v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
});

Waffle.addRenderer('uppercase', function (v) {
  return v.toUpperCase();
});

Waffle.create(document.getElementById('waffle'), {
  data: [
    { id: 1, firstName: 'john', lastName: 'doe' },
    { id: 2, firstName: 'jane', lastName: 'doe' },
  ],

  columns: [
    { id: 'firstName', renderer: [nullSafe, 'capitalize'] },
    { id: 'lastName', renderer: [nullSafe, 'uppercase'] }
  ]
});

function nullSafe(v) {
  return v == null ? '' : v;
}
```

A renderer can be:
- A `function`: the first parameter will be the value to render.
- A `string`: the renderer will be find in the global renderers dictionary.

By default, Waffle comes with renderers available out of the box:
- `$uppercase`: turn a string into a lowercase string (value will be converted to a string if needed).
- `$lowercase`: turn a string into an uppercase string (value will be converted to a string if needed).
- `$capitalize`: capitalize a string (value will be converted to a string if needed).
- `$identity`: return the parameter (mainly used internally).
- `$empty`: return an empty string (mainly used internally).

Note that these renderers can be overrided:

```javascript
// Override default capitalizer to capitalize each word in a string.
Waffle.addRenderer('$capitalize', function (v) {
  return v.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
});
```

**Important:** A renderer should be a very simple function (basically, returns a formatted value). Be careful to not define complex function to avoid performance issues.

## Selection

Selection in a grid seems a basic feature:
- Display checkbox for each rows.
- Display the number of selected rows.

Waffle offer selection for free:
- Enable the selection option.
- Set some custom parameters if you need (single, multiple selection).

Here is an example:

```javascript
const grid = Waffle.create(document.getElementById('waffle'), {
  data: [
    { id: 1, firstName: 'john', lastName: 'doe', gender: 'M' },
    { id: 2, firstName: 'jane', lastName: 'doe', gender: 'S' },
  ],

  columns: [
    { id: 'firstName', renderer: [nullSafe, 'capitalize'] },
    { id: 'lastName', renderer: [nullSafe, 'uppercase'] }
  ],

  selection: {
    checkbox: true, // Display a checkbox as the first column.
    multi: true     // Enable multi-selection.
  }
});
```

**Important:** selection is enabled by default, set the `selection` property to `false` to disable it (or set the `selection.enabled` property to `false`).

With these options:
- A click on a row will toggle the selection of the entire row (the checkbox will be checked or unchecked).
- The number of selected row will be updated in the grid header.

When multi-selection is enabled, you can select rows and:
- Press the `ctrl` key to add the row to the current selection.
- Press the `shift` key to add a set of rows to the current selection.

The selection can be used programmatically (get / set the selection) using the `selection` method:

```javascript
// Display the current selection in the console:
grid.selection().forEach(x => console.log(x));

// Remove the entire selection
grid.selection().clear();

// Add to the selection people where gender === 'M':
grid.selection().add(grid.data().filter(x => x.gender === 'M'));
```

All you need to do is to manipulate the selection (as you would do with a classic `array`):
- no need to manipulate the DOM,
- no need to trigger a `render`,
- etc.

*Note:* The `grid#selection` method returns an instance of `Collection` (see the API of `Collection` to get the list of available methods).

## Edition

TODO
