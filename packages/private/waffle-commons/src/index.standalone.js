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

import {isUndefinedFactory} from './core/is-undefined';
import {isNullFactory} from './core/is-null';
import {isNilFactory} from './core/is-nil';
import {isObjectFactory} from './core/is-object';
import {isElementFactory} from './core/is-element';
import {isStringFactory} from './core/is-string';
import {isNumberFactory} from './core/is-number';
import {isBooleanFactory} from './core/is-boolean';
import {isDateFactory} from './core/is-date';
import {identityFactory} from './core/identity';
import {hasFactory} from './core/has';
import {keysFactory} from './core/keys';
import {forEachFactory} from './core/for-each';
import {findFactory} from './core/find';
import {defaultsFactory} from './core/defaults';
import {filterFactory} from './core/filter';
import {indexByFactory} from './core/index-by';
import {toStringFactory} from './core/to-string';
import {toUpperFactory} from './core/to-upper';
import {toLowerFactory} from './core/to-lower';
import {capitalizeFactory} from './core/capitalize';

export const isUndefined = isUndefinedFactory();
export const isNull = isNullFactory();
export const isNil = isNilFactory(isUndefined, isNull);
export const isObject = isObjectFactory();
export const isElement = isElementFactory();
export const isString = isStringFactory();
export const isNumber = isNumberFactory();
export const isBoolean = isBooleanFactory();
export const isDate = isDateFactory();
export const identity = identityFactory();
export const has = hasFactory();
export const keys = keysFactory(has);
export const forEach = forEachFactory();
export const find = findFactory();
export const defaults = defaultsFactory(forEach, keys, isUndefined);
export const filter = filterFactory();
export const indexBy = indexByFactory(isString);
export const toString = toStringFactory(isNil);
export const toUpper = toUpperFactory(toString);
export const toLower = toLowerFactory(toString);
export const capitalize = capitalizeFactory(toString);
