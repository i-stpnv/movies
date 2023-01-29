import React, { Component } from 'react'
import { debounce } from 'lodash'

import './SearchLine.css'

export default class SearchLine extends Component {
  render() {
    return (
      <input
        className="search-line"
        onChange={(e) => debounce(this.props.onSearch, 2000)(e.target.value)}
        placeholder="Type to search..."
      />
    )
  }
}
