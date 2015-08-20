/**
 * Build files array required for concatenation,
 * minification and tests.
 */

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var log = require('log4js').getLogger();

var SRC = 'src/';
var TEST = 'test/';
var VENDOR_SRC = 'vendors/';

// Core files
var $files = {
  // jQuery lite
  $jq: [
    SRC + 'core/jq-lite/jq-lite.js'
  ],

  // underscore lite
  $underscore: [
    SRC + 'core/underscore-lite/underscore-base-lite.js',
    SRC + 'core/underscore-lite/underscore-lite.js'
  ],

  $underscoreSanitize: [
    SRC + 'extensions/underscore/sanitize.js'
  ],

  $coreJson: [
    SRC + 'core/commons/json.js'
  ],

  $coreParser: [
    SRC + 'core/data-structures/stack.js',
    SRC + 'core/commons/parser.js'
  ],

  $coreSanitize: [
    SRC + 'core/commons/sanitize.js'
  ],

  $coreMap: [
    SRC + 'core/data-structures/map.js'
  ],

  $coreSniffer: [
    SRC + 'core/commons/sniffer.js'
  ],

  // Core source, mandatory source files appended to each target
  $core: [
    SRC + 'core/constants.js',
    SRC + 'core/commons/util.js',
    SRC + 'core/commons/dom.js',
    SRC + 'core/commons/vdom.js',
    SRC + 'core/events/event-bus.js',
    SRC + 'core/observable/observable.js',
    SRC + 'core/services/renderers.js',
    SRC + 'core/services/comparators.js',
    SRC + 'core/services/filters.js',
    SRC + 'core/grid/models/collection.js',
    SRC + 'core/grid/models/column.js',
    SRC + 'core/grid/commons/grid-util.js',
    SRC + 'core/grid/dom/grid-dom-handlers.js',
    SRC + 'core/grid/dom/grid-dom-binders.js',
    SRC + 'core/grid/builder/grid-builder.js',
    SRC + 'core/grid/resize/grid-resizer.js',
    SRC + 'core/grid/observers/grid-data-observer.js',
    SRC + 'core/grid/observers/grid-columns-observer.js',
    SRC + 'core/grid/observers/grid-selection-observer.js',
    SRC + 'core/grid/filter/grid-filter.js',
    SRC + 'core/grid/grid.js',
    SRC + 'core/waffle.js'
  ],

  $angularDirective: [
    SRC + 'extensions/angular/waffle-angular-service.js',
    SRC + 'extensions/angular/grid-angular-template.js',
    SRC + 'extensions/angular/grid-compilation-angular.js',
    SRC + 'extensions/angular/grid-angular.js'
  ],

  $angularPlugin: [
    SRC + 'core/underscore-lite/underscore-base-lite.js',
    SRC + 'extensions/angular/underscore-angular.js',
    SRC + 'extensions/angular/jq-angular.js',
    SRC + 'extensions/angular/json-angular.js',
    SRC + 'extensions/angular/waffle-angular-module.js',
    SRC + 'extensions/angular/waffle-angular-run.js'
  ],

  $jqueryPlugin: [
    SRC + 'extensions/jquery/waffle-jquery.js'
  ],

  $polymerPlugin: [
    SRC + 'extensions/polymer/waffle-polymer.js'
  ],

  $reactPlugin: [
    SRC + 'extensions/react/waffle-react-mixin.js',
    SRC + 'extensions/react/waffle-react.js'
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
  },
  $react: {
    src: [
      VENDOR_SRC + 'es5-shim/es5-shim.js',
      VENDOR_SRC + 'react/react-with-addons.js'
    ],
    test: [
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
      TEST + 'core/jq-lite/jq-lite-spec.js',
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
      TEST + 'core/underscore-lite/underscore-lite-spec.js',
      TEST + 'core/underscore-lite/underscore-base-lite-spec.js'
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
      TEST + 'core/jq-lite/jq-lite-spec.js',

      // Add underscore-Lite spec to check compatibilty with underscore
      TEST + 'core/underscore-lite/underscore-lite-spec.js',
      TEST + 'core/underscore-lite/underscore-base-lite-spec.js'
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
      TEST + 'core/jq-lite/jq-lite-spec.js',

      // Add underscore-Lite spec to check compatibilty with angular
      TEST + 'core/underscore-lite/underscore-lite-spec.js',

      // Add parser spec to check compatibilty with angular
      TEST + 'core/commons/parser-spec.js'
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
  },

  react: {
    template: 'wrap-template-react.js',
    src: [
      '$standalone',
      '$reactPlugin'
    ],
    vendor: [
      '$react'
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

  // Check that source file exists
  _.forEach(src, function(relativePath) {
    var fullPath = path.join(__dirname, '../', relativePath);

    try {
      fs.statSync(fullPath);
    } catch (e) {
      throw Error('File ' + relativePath + ' does not exist');
    }
  });

  return {
    template: template,
    src: src,
    vendor: vendor,
    test: test
  };
});

module.exports = targets;
