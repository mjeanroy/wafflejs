/**
 * Build files array required for concatenation,
 * minification and tests.
 */

var _ = require('underscore');
var log = require('log4js').getLogger();

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
    SRC + 'map.js'
  ],

  $coreSniffer: [
    SRC + 'sniffer.js'
  ],

  // Core source, mandatory source files appended to each target
  $core: [
    SRC + 'constants.js',
    SRC + 'util.js',
    SRC + 'dom.js',
    SRC + 'vdom.js',
    SRC + 'event-bus.js',
    SRC + 'observable.js',
    SRC + 'collection.js',
    SRC + 'renderers.js',
    SRC + 'comparators.js',
    SRC + 'column.js',
    SRC + 'grid-dom-handlers.js',
    SRC + 'grid-dom-binders.js',
    SRC + 'grid-builder.js',
    SRC + 'grid-resizer.js',
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
  ],

  $polymerPlugin: [
    SRC + 'polymer/waffle-polymer.js',
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
    template: 'wrap-template-standalone.js',
    src: [
      '$jq',
      '$underscore',
      '$coreJson',
      '$coreMap',
      '$coreSniffer',
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
    template: 'wrap-template-jquery.js',
    src: [
      '$underscore',
      '$coreJson',
      '$coreMap',
      '$coreSniffer',
      '$coreParser',
      '$coreSanitize',
      '$core',
      '$jqueryPlugin'
    ],
    vendor: [
      '$jquery'
    ],
    test: [
      // Add jq-Lite spec to check compatibilty with jquery
      TEST + 'jq-lite-spec.js',
    ]
  },

  underscore: {
    template: 'wrap-template-underscore.js',
    src: [
      '$jq',
      '$coreJson',
      '$coreMap',
      '$coreSniffer',
      '$coreParser',
      '$underscoreSanitize',
      '$core'
    ],
    vendor: [
      '$underscore'
    ],
    test: [
      // Add underscore-Lite spec to check compatibilty with underscore
      TEST + 'underscore-lite-spec.js',
    ]
  },

  bare: {
    template: 'wrap-template-bare.js',
    src: [
      '$coreJson',
      '$coreMap',
      '$coreSniffer',
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
      // Add jq-Lite spec to check compatibilty with jquery
      TEST + 'jq-lite-spec.js',

      // Add underscore-Lite spec to check compatibilty with underscore
      TEST + 'underscore-lite-spec.js',
    ]
  },

  angular: {
    template: 'wrap-template-angular.js',
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
  },

  polymer: {
    template: 'wrap-template-polymer.js',
    src: [
      '$standalone',
      '$polymerPlugin'
    ],
    vendor: [
    ],
    test: [
    ]
  }
};

// Build files needed for each targets
var targets = _.mapObject($targets, function(target, key) {
  var template = target.template;
  var src = target.src;
  var vendor = target.vendor;

  log.debug('Load files for target: ' + key);

  // Create array of source files
  var ended = false;

  var mapSrcFile = function(val) {
    var sources;

    if (_.isString(val)) {
      sources = $files[val] || $targets[val.slice(1)] || val;
    }

    if (_.has(sources, 'src')) {
      sources = sources.src;
    }

    if (!sources) {
      sources = val;
    }

    return sources;
  };

  while (!ended) {
    src = _.map(src, function(val) {
      var source = mapSrcFile(val);
      ended = ended || source === val;
      return source;
    });

    src = _.flatten(src);
  }

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
    template: template,
    src: src,
    vendor: vendor,
    test: test
  };
});

module.exports = targets;
