/**
 * Build files array required for concatenation,
 * minification and tests.
 */

var _ = require('underscore');

var SRC = 'src/';
var TEST = 'test/';
var VENDOR_SRC = 'node_modules/';

// Core files
var $files = {
  // jQuery lite
  $jq: [
    SRC + 'jq-lite.js'
  ],

  // underscore lite
  $underscore: [
    SRC + 'underscore-base-lite.js',
    SRC + 'underscore-lite.js'
  ],

  // Core source, mandatory source files appended to each target
  $core: [
    SRC + 'parser.js',
    SRC + 'sanitize.js',
    SRC + 'constants.js',
    SRC + 'dom.js',
    SRC + 'collection.js',
    SRC + 'renderers.js',
    SRC + 'comparators.js',
    SRC + 'column.js',
    SRC + 'grid.js',
    SRC + 'waffle.js'
  ],

  $angularDirective: [
    SRC + 'angular/grid-angular.js'
  ],

  $angularPlugin: [
    SRC + 'angular/waffle-angular.js',
    SRC + 'angular/jq-angular.js',
    SRC + 'underscore-base-lite.js',
    SRC + 'angular/underscore-angular.js',
    SRC + 'angular/underscore-angular.js'
  ],

  $jqueryPlugin: [
    SRC + 'jquery/waffle-jquery.js',
  ]
};

// Core vendor (i.e required external libraries for tests)
var $vendor = {
  $jquery: VENDOR_SRC + 'jquery/dist/jquery.js',
  $underscore: VENDOR_SRC + 'underscore/underscore.js',
  $angular: VENDOR_SRC + 'angular/angular.js'
};

var $test = [
  VENDOR_SRC + 'jasmine-utils/src/jasmine-utils.js'
];

// Module targets
var $targets = {
  standalone: {
    src: [
      '$jq',
      '$underscore',
      '$core'
    ],
    vendor: [
    ],
    test: [
    ]
  },

  jquery: {
    src: [
      '$underscore',
      '$core',
      '$jqueryPlugin'
    ],
    vendor: [
      '$jquery'
    ],
    test: [
    ]
  },

  underscore: {
    src: [
      '$jq',
      '$core'
    ],
    vendor: [
      '$underscore'
    ],
    test: [
    ]
  },

  bare: {
    src: [
      '$core',
      '$jqueryPlugin'
    ],
    vendor: [
      '$jquery',
      '$underscore'
    ],
    test: [
    ]
  },

  angular: {
    src: [
      '$angularPlugin',
      '$core',
      '$angularDirective'
    ],
    vendor: [
      '$angular'
    ],
    test: [
      VENDOR_SRC + 'angular-mocks/angular-mocks.js',

      // Add jq-Lite spec to check compatibilty with angular jq-Lite
      TEST + 'jq-lite-spec.js',

      // Add underscore-Lite spec to check compatibilty with angular jq-Lite
      TEST + 'underscore-lite-spec.js'
    ]
  }
};

// Build files needed for each targets
var targets = _.mapObject($targets, function(target) {
  var src = target.src.concat('$core');
  var vendor = target.vendor;

  // Create array of source files
  src = _.map(src, function(val) {
    return $files[val];
  });

  // Create array of vendor files
  vendor = _.map(vendor, function(val) {
    return $vendor[val];
  });

  // Create array of test files
  test = _.map(src, function(val) {
    return _.map($files[val], function(f) {
    	console.log(f);
      return TEST + f.replace('.js', '-spec.js');
    });
  });

  src = _.flatten(src);
  vendor = _.flatten(vendor);

  // Create array of spec files
  // Each source file should have a spec file
  var specs = _.map(src, function(f) {
    return f.replace(SRC, TEST)
            .replace('.js', '-spec.js');
  });

  var test = $test
    .concat(target.test)
    .concat(specs);

  return {
    src: src,
    vendor: vendor,
    test: test
  };
});

module.exports = targets;
