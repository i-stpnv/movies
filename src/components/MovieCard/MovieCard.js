import React, { Component } from 'react'
import { format } from 'date-fns'
import { Rate } from 'antd'

import { GenresContext } from '../../GenresContext'
import noPosterPic from '../../assets/no_poster_pic.jpg'
import './MovieCard.css'

export default class MovieCard extends Component {
  state = { myRate: null }

  render() {
    const { movieID, posterPath, title, movieGenres, rate, myRate, releaseDate, overview } = this.props

    let rateClasses = ['movie-rate']
    if (rate >= 3 && rate < 5) rateClasses.push('bad')
    else if (rate >= 5 && rate < 7) rateClasses.push('ok')
    else if (rate >= 7) rateClasses.push('good')

    return (
      <GenresContext.Consumer>
        {(genres) => (
          <li className="movie-card">
            <img
              alt="Poster"
              className="movie-img"
              src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : noPosterPic}
            />
            <div className="movie-description">
              <div className="card-header">
                <div className="movie-title">{title}</div>
                <div className={rateClasses.join(' ')}>{rate.toPrecision(2)}</div>
              </div>
              <div className="movie-release-date">
                {releaseDate ? format(new Date(releaseDate), 'MMMM d, u') : null}
              </div>
              {genres && (
                <div className="genres">
                  {genres.map((g) => {
                    if (movieGenres.indexOf(g.id) !== -1) {
                      return (
                        <span key={g.id} className="movie-genre">
                          {g.name}
                        </span>
                      )
                    }
                  })}
                </div>
              )}
              <div className="movie-overview">{overview.length > 140 ? overview.slice(0, 140) + '...' : overview}</div>
              <Rate
                value={this.state.myRate ? this.state.myRate : myRate}
                allowClear={true}
                allowHalf={true}
                count={10}
                onChange={(newRate) => {
                  this.props.onRated(movieID, newRate)
                  this.setState({ myRate: newRate })
                }}
              />
            </div>
          </li>
        )}
      </GenresContext.Consumer>
    )
  }
}
