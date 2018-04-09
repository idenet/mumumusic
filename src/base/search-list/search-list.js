import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import './search-list.styl'

export default class SearchList extends Component {
  static propTypes = {
    searches: PropTypes.array,
    selectItem: PropTypes.func,
    deleteOne: PropTypes.func
  }
  static defaultProps = {
    searches: [],
    selectItem: f => f,
    deleteOne: f => f
  }
  handleDeleteOne(v, e) {
    e.stopPropagation()
    this.props.deleteOne(v)
  }
  render() {
    return (
      <div className="search-list">
        <TransitionGroup>
          {this.props.searches
            ? this.props.searches.map((v, i) => (
                <CSSTransition key={v} timeout={300} classNames="list">
                  <li
                    className="search-item"
                    onClick={() => this.props.selectItem(v)}
                  >
                    <span className="text">{v}</span>
                    <span
                      className="icon"
                      onClick={e => this.handleDeleteOne(v, e)}
                    >
                      <i className="icon-delete" />
                    </span>
                  </li>
                </CSSTransition>
              ))
            : null}
        </TransitionGroup>
      </div>
    )
  }
}
