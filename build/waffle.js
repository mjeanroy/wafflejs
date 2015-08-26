/**
 * Build files array required for concatenation,
 * minification and tests.
 *
 * Exported module is an object:
 * - Key is the target waffle build.
 * - Value is object with following entries:
 *   - "template": template used to produce waffle-build.
 *   - "src": source files to concatenate.
 *   - "vendors": vendors files to append during unit tests.
 *   - "test": test files to load during unit testing.
 */

var log = require('log4js').getLogger();
var $vendor = require('./vendors');
var $core = require('./core');
var $test = require('./test');

// Build target configuration.
var $targets = {};

Object.keys($core).forEach(function(placeholder) {
  var target = {};
  var key = placeholder.slice(1);

  log.debug('Load configuration for waffle # ' + key);

  target.template = 'wrap-template-' + key + '.js';
  target.src = $core[placeholder];
  target.test = $test[placeholder];

  // Prepend base spec file.
  // Provide some unit test utilities.
  target.test.unshift('test/base-spec.js');

  // Configure vendor src & test files (optional).
  var vendors = $vendor[placeholder] || {};
  target.vendor = vendors.src || [];
  target.test = (vendors.test || []).concat(target.test);

  // Prepend jasmine plugin.
  target.test.unshift('node_modules/jasmine-utils/src/jasmine-utils.js');

  // Add to dictionary
  $targets[key] = target;
});

module.exports = $targets;
