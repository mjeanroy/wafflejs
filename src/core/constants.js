/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy
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

/* exported CSS_PREFIX */
/* exported CSS_GRID */
/* exported CSS_SORTABLE */
/* exported CSS_SORTABLE_ASC */
/* exported CSS_SORTABLE_DESC */
/* exported CSS_SELECTED */
/* exported DATA_WAFFLE_ID */
/* exported DATA_WAFFLE_SORTABLE */
/* exported DATA_WAFFLE_ORDER */
/* exported DATA_WAFFLE_IDX */
/* exported DATA_WAFFLE_CID */
/* exported CHAR_ORDER_ASC */
/* exported CHAR_ORDER_DESC */
/* exported CSS_SCROLLABLE */
/* exported CSS_SELECTABLE */
/* exported CSS_CHECKBOX_CELL */
/* exported CSS_DRAGGABLE */
/* exported CSS_DRAGGABLE_DRAG */
/* exported CSS_DRAGGABLE_OVER */
/* exported TBODY */
/* exported THEAD */
/* exported TFOOT */
/* exported TABLE */

/**
 * Set of constants used across all project components.
 */

const CSS_PREFIX = 'waffle-';
const CSS_GRID = CSS_PREFIX + 'grid';
const CSS_SORTABLE = CSS_PREFIX + 'sortable';
const CSS_SORTABLE_ASC = CSS_SORTABLE + '-asc';
const CSS_SORTABLE_DESC = CSS_SORTABLE + '-desc';
const CSS_DRAGGABLE = CSS_PREFIX + 'draggable';
const CSS_DRAGGABLE_DRAG = CSS_DRAGGABLE + '-drag';
const CSS_DRAGGABLE_OVER = CSS_DRAGGABLE + '-over';
const CSS_SCROLLABLE = CSS_PREFIX + 'fixedheader';
const CSS_SELECTABLE = CSS_PREFIX + 'selectable';
const CSS_SELECTED = CSS_PREFIX + 'selected';
const CSS_CHECKBOX_CELL = CSS_PREFIX + 'checkbox';

const DATA_PREFIX = 'data-waffle-';
const DATA_WAFFLE_CID = DATA_PREFIX + 'cid';
const DATA_WAFFLE_ID = DATA_PREFIX + 'id';
const DATA_WAFFLE_SORTABLE = DATA_PREFIX + 'sortable';
const DATA_WAFFLE_ORDER = DATA_PREFIX + 'order';
const DATA_WAFFLE_IDX = DATA_PREFIX + 'idx';

const CHAR_ORDER_ASC = '+';
const CHAR_ORDER_DESC = '-';

// Save bytes
const TBODY = 'tbody';
const THEAD = 'thead';
const TFOOT = 'tfoot';
const TABLE = 'table';
