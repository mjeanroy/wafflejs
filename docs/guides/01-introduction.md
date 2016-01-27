# Introduction

## Why another datagrid ?

Few years ago, I wrote my first datagrid as a jQuery plugin: it worked great but suffered from several limitations:
- Hard to use without jQuery (especially true when I started to use `angular`).
- Performant, but not optimal: each modification triggered a full render.

When I started to use `angular`, I decided to rewrite a new datagrid with angular API:
- Use only API provided by JqLite.
- Use databinding to avoid full render.

It was great, but not performant at all: each digest cycle was really slow: it makes
sense since a lot of bindings were implied. I decided to improve the grid, and skip angular
bindings (sort of hybrid component with JavaScript rendering, and bridges to angular digest cycle).

When I rewrote the same datagrid to use with React, I decided to write a datagrid easy to use regardless of the framework.

Here are the main goals of this implementation:
- Framework agnostic: easy to use regardless of the framework, but use the framework API if it is appropriate.
- Do not trigger a full rendering when a data is added or removed.
- Performant: it must remain performant, whatever the number of rows to display.

I am happy to say today that these goals are achieved (see the architecture overview to have deep explanation).

## Installation

### Sources

Waffle is available on npm and bower. Once installed, you will see the following directory:

```
|
|- dist
  |- waffle-angular.js
  |- waffle-angular-min.js
  |- waffle-bare.js
  |- waffle-bare-min.js
  |- waffle-backbone.js
  |- waffle-backbone-min.js
  |- waffle-jquery.js
  |- waffle-jquery-min.js
  |- waffle-polymer.js
  |- waffle-polymer-min.js
  |- waffle-react.js
  |- waffle-react-min.js
  |- waffle-standalone.js
  |- waffle-standalone-min.js
  |- waffle-underscore.js
  |- waffle-underscore-min.js
```

The `dist` directory contains bundles to use in your application. You can see lot of bundles: this is because
Waffle has been designed to work with popular JavaScript frameworks out of the box.
Choose your bundle and you're done !

**Note:** Waffle should works great with AMD, commonjs or as a global variable.

### NPM

Waffle is available on NPM:

```bash
npm install --save-dev wafflejs
```

### Bower

Waffle is available on Bower:

```bash
bower install --save wafflejs
```

*Working with `wiredep`:* If you use `wiredep` to automatically inject your bower dependencies into your html files,
you may have to override the `main` file. It depends on which bundle you want to use, here is an example with `waffle-angular`:

```json
{
  "dependencies": {
    "angular": "~1.4.9",
    "wafflejs": "~0.6.0"
  },

  "overrides": {
    "wafflejs": {
      "main": ["dist/waffle.css", "dist/waffle-angular.js"],
      "depependencies": {
        "angular": "~1.4.9"
      }
    }
  }
}
```

## License

Licensed under the MIT license.
