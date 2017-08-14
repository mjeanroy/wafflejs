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

import _ from 'underscore';

import {isNilFactory} from './core/is-nil';
import {toStringFactory} from './core/to-string';
import {toUpperFactory} from './core/to-upper';
import {toLowerFactory} from './core/to-lower';
import {capitalizeFactory} from './core/capitalize';

export const isUndefined = _.isUndefined;
export const isNull = _.isNull;
export const isObject = _.isObject;
export const isElement = _.isElement;
export const isString = _.isString;
export const isNumber = _.isNumber;
export const isDate = _.isDate;
export const isBoolean = _.isBoolean;
export const identity = _.identity;
export const has = _.has;
export const keys = _.keys;
export const forEach = _.forEach;
export const defaults = _.defaults;
export const filter = _.filter;
export const indexBy = _.indexBy;
export const find = _.find;

export const isNil = isNilFactory(isUndefined, isNull);
export const toString = toStringFactory(isNil);
export const toUpper = toUpperFactory(toString);
export const toLower = toLowerFactory(toString);
export const capitalize = capitalizeFactory(toString);
