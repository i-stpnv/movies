import React, { Component } from 'react'
import { Alert, Spin, Tabs, Pagination } from 'antd'

import TMDBApi from '../../services/TMDBService'
import SearchLine from '../SearchLine/SearchLine'
import MoviesList from '../MoviesList/MoviesList'
import { GenresContext } from '../GenresContext/GenresContext'

import './App.css'

export default class App extends Component {
  tmdbApi = new TMDBApi()

  state = {
    movies: null,
    loading: true,
    error: false,
    currentPage: null,
    totalPages: null,
    currentQuery: 'green',
    genres: null,
  }

  componentDidMount() {
    this.tmdbApi.createGuestSession().then((s) => {
      localStorage.setItem('guestSessionID', s.guest_session_id)
    })
    this.tmdbApi.searchMovies(this.state.currentQuery).then((res) => {
      this.setState({
        movies: res.results,
        loading: false,
        currentPage: res.page,
        totalPages: res.total_pages,
      })
    })
    this.tmdbApi.getGenres().then((genres) => {
      this.setState({ genres })
    })
  }

  getMovies = (query, page = 1) => {
    if (query.trim() !== '') {
      this.setState({
        movies: [],
        loading: true,
      })
      this.tmdbApi.searchMovies(query, page).then((res) => {
        this.setState({
          movies: res.results,
          loading: false,
          currentPage: res.page,
          totalPages: res.total_pages,
          currentQuery: query,
        })
      })
    }
  }

  goToPage = (pageNum) => {
    this.getMovies(this.state.currentQuery, pageNum)
  }

  setRate = (id, rate) => {
    this.tmdbApi.rateMovie(id, rate)
  }

  render() {
    const { movies, loading, currentPage, totalPages } = this.state
    const tabs = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div className="wrapper">
            <SearchLine onSearch={this.getMovies} />
            {loading ? (
              <Spin />
            ) : movies && movies.length > 0 ? (
              <MoviesList movies={movies} onRated={this.setRate} />
            ) : (
              <Alert message="No movies found :(" />
            )}
            <Pagination
              showSizeChanger={false}
              current={currentPage}
              total={totalPages * 20}
              defaultPageSize={20}
              onChange={(page) => this.goToPage(page)}
            />
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <div className="wrapper">
            {loading ? (
              <Spin />
            ) : movies && movies.length > 0 ? (
              <MoviesList movies={movies} onRated={this.setRate} />
            ) : (
              <Alert message="No rated movies :(" />
            )}
            <Pagination
              showSizeChanger={false}
              current={currentPage}
              total={totalPages * 20}
              defaultPageSize={20}
              onChange={(page) => this.goToPage(page)}
            />
          </div>
        ),
      },
    ]
    if (!movies) return <Spin />
    else {
      return (
        <GenresContext.Provider value={this.state.genres}>
          <div className="App">
            <Tabs
              centered
              items={tabs}
              onChange={(tab) => {
                if (tab === '2') {
                  this.tmdbApi.getRatedMovies().then((ratedMovies) => {
                    this.setState({
                      movies: ratedMovies.results,
                      loading: false,
                      currentPage: ratedMovies.page,
                      totalPages: ratedMovies.total_pages,
                    })
                  })
                } else if (tab === '1') {
                  this.tmdbApi.searchMovies(this.state.currentQuery).then((res) => {
                    this.setState({
                      movies: res.results,
                      loading: false,
                      currentPage: res.page,
                      totalPages: res.total_pages,
                    })
                  })
                }
              }}
            />
          </div>
        </GenresContext.Provider>
      )
    }
  }
}
