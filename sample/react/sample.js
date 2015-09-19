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

/* global waffleOptions */
/* global ajax */
/* global React */
/* global Waffle */

// TODO Use Flux architecture.

(function(ajax, React) {

  // Update options

  // Enable scrolling on tbody.
  waffleOptions.scrollable = true;

  // Enable drag&drop
  waffleOptions.dnd = true;

  // Enable automatic column sizing.
  waffleOptions.size = {
    width: 'auto'
  };

  // Enable multi selection.
  waffleOptions.selection = {
    multi: true
  };

  // Initial sort.
  waffleOptions.sortBy = 'name()';

  var url = '/people';

  var App = React.createClass({
    getInitialState: function() {
      return {
        filter: ''
      };
    },

    getInitialGridOptions: function() {
      return waffleOptions;
    },

    componentDidMount: function() {
      ajax('GET', url, function(response) {
        this.grid().data().reset(response);
      }.bind(this));
    },

    render: function() {
      return (
        <div>
          <div className="panel panel-default">
            <div className="panel-heading">Actions</div>
            <div className="panel-body">
              <button type="button" onClick={this.addPerson} className="btn btn-primary" title="Add Person">Add Person</button>
              <button type="button" onClick={this.removePerson} className="btn btn-primary" title="Remove Last">Remove Last</button>
              <button type="button" onClick={this.clearAll} className="btn btn-primary" title="Clear">Clear</button>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading">Filter</div>
            <div className="panel-body">
              <label>Filter data (contains): </label>
              <input id="input-filter"
                     type="text"
                     className="form-control inline-control"
                     placeholder="Filter data (by name)..."
                     value={this.state.filter}
                     onChange={this.updateFilter}
                     ref="inputFilter"/>

              <i id="clear-filter" role="button" className="Clear Filter" onClick={this.clearFilter}>
                <big>
                  <strong dangerouslySetInnerHTML={{__html: '&times;'}}></strong>
                </big>
              </i>
            </div>
          </div>
          <Waffle ref="waffle" waffle={this.getInitialGridOptions()} className="table table-striped table-hover table-bordered"></Waffle>
        </div>
      );
    },

    grid: function() {
      return this.refs.waffle.getGrid();
    },

    updateFilter: function(event) {
      var value = event.target.value;

      this.setState({
        filter: value
      });

      this.grid().filter({
        'name()': value
      });
    },

    clearFilter: function() {
      this.setState({
        filter: ''
      });

      this.grid().removeFilter();
    },

    addPerson: function() {
      ajax('POST', url, function(response) {
        this.grid().data().push(response);
      }.bind(this));
    },

    removePerson: function() {
      var last = this.grid().data().last();
      if (last) {
        ajax('DELETE', url + '/' + last.id, function() {
          this.grid().data().remove(last);
        }.bind(this));
      }
    },

    clearAll: function() {
      ajax('DELETE', url, function() {
        this.grid().data().clear();
      }.bind(this));
    }
  });

  React.render(<App />, document.getElementById('container'));
})(ajax, React);
