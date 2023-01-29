export default class TMDBApi {
  BASE_URL = 'https://api.themoviedb.org/3/'
  API_KEY = 'baa89c7ab3fc3ff6881f5a6304b9cca8'

  async getResource(url) {
    const res = await fetch(`${this.BASE_URL}${url}`)
    if (!res.ok) {
      throw new Error('Could not fetch data due to server error!')
    }
    return await res.json()
  }

  async searchMovies(query, page = 1) {
    const res = await this.getResource(`search/movie?api_key=${this.API_KEY}&query=${query}&page=${page}`)
    return res
  }

  async createGuestSession() {
    const guestSession = await this.getResource(`authentication/guest_session/new?api_key=${this.API_KEY}`)
    return guestSession
  }

  async rateMovie(movieID, newRate) {
    const res = await fetch(
      `${this.BASE_URL}movie/${movieID}/rating?api_key=${this.API_KEY}&guest_session_id=${localStorage.getItem(
        'guestSessionID'
      )}`,
      {
        method: 'POST',
        body: JSON.stringify({
          value: newRate,
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    )
    return await res.json()
  }

  async getRatedMovies() {
    const guestSessionID = localStorage.getItem('guestSessionID')
    const rated = await this.getResource(
      `guest_session/${guestSessionID}/rated/movies?api_key=${this.API_KEY}&language=en-US&sort_by=created_at.asc`
    )
    return rated
  }

  async getGenres() {
    const res = await this.getResource(`genre/movie/list?api_key=${this.API_KEY}`)
    return res.genres
  }
}
