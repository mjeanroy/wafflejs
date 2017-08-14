/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2017 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {isUndefinedSpec} from './is-undefined.spec';
import {isNullSpec} from './is-null.spec';
import {isNilSpec} from './is-nil.spec';
import {isObjectSpec} from './is-object.spec';
import {isStringSpec} from './is-string.spec';
import {identitySpec} from './identity.spec';
import {hasSpec} from './has.spec';
import {keysSpec} from './keys.spec';
import {forEachSpec} from './for-each.spec';
import {defaultsSpec} from './defaults.spec';
import {filterSpec} from './filter.spec';
import {indexBySpec} from './index-by.spec';
import {toStringSpec} from './to-string.spec';
import {toUpperSpec} from './to-upper.spec';
import {toLowerSpec} from './to-lower.spec';
import {capitalizeSpec} from './capitalize.spec';

/**
 * Run test suite.
 *
 * @param {Object} _ Commons utility object.
 * @return {void}
 */
export function testSuite(_) {
  isUndefinedSpec(_.isUndefined);
  isNullSpec(_.isNull);
  isNilSpec(_.isNil);
  isObjectSpec(_.isObject);
  isStringSpec(_.isString);
  identitySpec(_.identity);
  hasSpec(_.has);
  keysSpec(_.keys);
  forEachSpec(_.forEach);
  defaultsSpec(_.defaults);
  filterSpec(_.filter);
  indexBySpec(_.indexBy);
  toStringSpec(_.toString);
  toUpperSpec(_.toUpper);
  toLowerSpec(_.toLower);
  capitalizeSpec(_.capitalize);
}
