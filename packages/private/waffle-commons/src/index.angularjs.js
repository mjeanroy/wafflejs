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

import angular from 'angular';

import {isNullFactory} from './core/is-null';
import {isNilFactory} from './core/is-nil';
import {isBooleanFactory} from './core/is-boolean';
import {hasFactory} from './core/has';
import {keysFactory} from './core/keys';
import {sizeFactory} from './core/size';
import {isEmptyFactory} from './core/is-empty';
import {findFactory} from './core/find';
import {defaultsFactory} from './core/defaults';
import {filterFactory} from './core/filter';
import {rejectFactory} from './core/reject';
import {indexByFactory} from './core/index-by';
import {nowFactory} from './core/now';
import {toStringFactory} from './core/to-string';
import {toUpperFactory} from './core/to-upper';
import {toLowerFactory} from './core/to-lower';
import {capitalizeFactory} from './core/capitalize';

// Methods from AngularJS
export const isUndefined = angular.isUndefined;
export const isObject = angular.isObject;
export const isElement = angular.isElement;
export const isString = angular.isString;
export const isNumber = angular.isNumber;
export const isDate = angular.isDate;
export const isArray = angular.isArray;
export const isFunction = angular.isFunction;
export const identity = angular.identity;
export const forEach = angular.forEach;

// Factories
export const isNull = isNullFactory();
export const isNil = isNilFactory(isUndefined, isNull);
export const isBoolean = isBooleanFactory();
export const has = hasFactory();
export const keys = keysFactory(has);
export const size = sizeFactory(isNil);
export const isEmpty = isEmptyFactory(size);
export const find = findFactory();
export const defaults = defaultsFactory(forEach, keys, isUndefined);
export const filter = filterFactory();
export const reject = rejectFactory(filter);
export const indexBy = indexByFactory(isString);
export const now = nowFactory();
export const toString = toStringFactory(isNil);
export const toUpper = toUpperFactory(toString);
export const toLower = toLowerFactory(toString);
export const capitalize = capitalizeFactory(toString);
