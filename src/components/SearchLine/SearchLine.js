import React, { Component } from 'react'
import { debounce } from 'lodash'

import './SearchLine.css'

export default class SearchLine extends Component {
  debounceSearch = debounce(this.props.onSearch, 1500)

  render() {
    return (
      <input
        className="search-line"
        onChange={(e) => this.debounceSearch(e.target.value)}
        placeholder="Type to search..."
      />
    )
  }
}
