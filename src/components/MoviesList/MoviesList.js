import React, { Component } from 'react'

import MovieCard from '../MovieCard/MovieCard'

import './MoviesList.css'

export default class MoviesList extends Component {
  render() {
    const { movies, onRated } = this.props
    return (
      <ul className="movies-list">
        {movies.map((m) => {
          return (
            <MovieCard
              key={m.id}
              movieID={m.id}
              posterPath={m.poster_path}
              title={m.title}
              movieGenres={m.genre_ids}
              rate={m.vote_average}
              myRate={m.rating}
              releaseDate={m.release_date}
              overview={m.overview}
              onRated={onRated}
            />
          )
        })}
      </ul>
    )
  }
}
