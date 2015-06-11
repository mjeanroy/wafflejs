/**
 * Build files array required for concatenation,
 * minification and tests.
 */

var _ = require('underscore');

var SRC = 'src/';
var TEST = 'test/';
var VENDOR_SRC = 'vendors/';

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

  $underscoreSanitize: [
    SRC + 'underscore/sanitize.js'
  ],

  $coreJson: [
    SRC + 'json.js'
  ],

  $coreParser: [
    SRC + 'parser.js'
  ],

  $coreSanitize: [
    SRC + 'sanitize.js'
  ],

  $coreMap: [
    SRC + 'map.js',
  ],

  // Core source, mandatory source files appended to each target
  $core: [
    SRC + 'constants.js',
    SRC + 'util.js',
    SRC + 'dom.js',
    SRC + 'event-bus.js',
    SRC + 'observable.js',
    SRC + 'collection.js',
    SRC + 'renderers.js',
    SRC + 'comparators.js',
    SRC + 'column.js',
    SRC + 'grid-builder.js',
    SRC + 'grid-dom-handlers.js',
    SRC + 'grid-builder.js',
    SRC + 'grid-data-observer.js',
    SRC + 'grid-columns-observer.js',
    SRC + 'grid-selection-observer.js',
    SRC + 'grid.js',
    SRC + 'waffle.js'
  ],

  $angularDirective: [
    SRC + 'angular/waffle-angular-service.js',
    SRC + 'angular/grid-angular.js'
  ],

  $angularPlugin: [
    SRC + 'underscore-base-lite.js',
    SRC + 'angular/underscore-angular.js',
    SRC + 'angular/jq-angular.js',
    SRC + 'angular/json-angular.js',
    SRC + 'angular/waffle-angular-module.js',
    SRC + 'angular/waffle-angular-run.js',
  ],

  $jqueryPlugin: [
    SRC + 'jquery/waffle-jquery.js',
  ]
};

// Core vendor (i.e required external libraries for tests)
var $vendor = {
  $jquery: {
    src: [
      VENDOR_SRC + 'jquery/dist/jquery.js'
    ],
    test: [
    ]
  },
  $underscore: {
    src: [
      VENDOR_SRC + 'underscore/underscore.js'
    ],
    test: [
    ]
  },
  $angular: {
    src: [
      VENDOR_SRC + 'angular/angular.js',
      VENDOR_SRC + 'angular-sanitize/angular-sanitize.js'
    ],
    test: [
      VENDOR_SRC + 'angular-mocks/angular-mocks.js'
    ]
  }
};

var $test = [
  'node_modules/jasmine-utils/src/jasmine-utils.js'
];

// Module targets
var $targets = {
  standalone: {
    src: [
      '$jq',
      '$underscore',
      '$coreJson',
      '$coreMap',
      '$coreParser',
      '$coreSanitize',
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
      '$coreJson',
      '$coreMap',
      '$coreParser',
      '$coreSanitize',
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
      '$coreJson',
      '$coreMap',
      '$coreParser',
      '$underscoreSanitize',
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
      '$coreJson',
      '$coreMap',
      '$coreParser',
      '$underscoreSanitize',
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
      '$coreMap',
      '$core',
      '$angularDirective'
    ],
    vendor: [
      '$angular'
    ],
    test: [
      // Add jq-Lite spec to check compatibilty with angular
      TEST + 'jq-lite-spec.js',

      // Add underscore-Lite spec to check compatibilty with angular
      TEST + 'underscore-lite-spec.js',

      // Add parser spec to check compatibilty with angular
      TEST + 'parser-spec.js'
    ]
  }
};

// Build files needed for each targets
var targets = _.mapObject($targets, function(target, key) {
  var src = target.src.concat('$core');
  var vendor = target.vendor;

  // Create array of source files
  src = _.map(src, function(val) {
    return $files[val];
  });

  // Create array of vendor test dependencies
  var vdrTests = _.map(vendor, function(val) {
    return $vendor[val].test;
  });

  // Create array of vendor files
  vendor = _.map(vendor, function(val) {
    return $vendor[val].src;
  });

  // Create array of test files
  var test = _.map(src, function(val) {
    return _.map($files[val], function(f) {
      return TEST + f.replace('.js', '-spec.js');
    });
  });

  src = _.flatten(src);
  vendor = _.flatten(vendor);
  vdrTests = _.flatten(vdrTests);

  // Create array of spec files
  // Each source file should have a spec file
  var specs = _.map(src, function(f) {
    return f.replace(SRC, TEST)
            .replace('.js', '*-spec.js');
  });

  test = $test
    .concat(vdrTests)
    .concat('test/base-spec.js')
    .concat(specs)
    .concat(target.test);

  return {
    src: src,
    vendor: vendor,
    test: test
  };
});

module.exports = targets;
