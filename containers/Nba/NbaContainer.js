import React, { Component } from 'react'
import { League } from 'components'
import { getTodaysDate, isValidDate } from 'helpers/utils'
import { getNbaScores } from 'helpers/api'
import { updatePageInfo } from 'config/metadata'

class NbaContainer extends Component {
  static defaultProps = { league: 'nba' }
  state = {
    isLoading: true,
    isValid: false,
    isError: false,
    scores: {},
    year: '',
    date: '',
    today: '',
    lastUpdated: null
  }

  componentDidMount() {
    const pageInfo = {
      title: `${this.props.league.toUpperCase()} scores · uxscoreboard`,
      desc: `live ${this.props.league.toUpperCase()} scores · uxscoreboard`
    }
    updatePageInfo(pageInfo)
    this.setState({ today: getTodaysDate() }, () => {
      this.makeRequest(this.props.match.params.date)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      clearTimeout(this.refreshId)
      this.makeRequest(this.props.match.params.date)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.delayId)
    clearTimeout(this.refreshId)
  }

  makeRequest(dt = this.state.today) {
    if (isValidDate(dt)) {
      this.setState({ isValid: true })
    }
    getNbaScores(dt)
      .then(data => {
        this.setState(
          {
            isLoading: false,
            scores: data.games,
            year: data.year,
            date: dt,
            lastUpdated: Date.now()
          },
          () => this.delay()
        )
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          isError: true,
          date: dt
        })
        throw new Error(error)
      })
      .then(() => {
        if (dt === this.state.today) {
          this.refreshScores(dt, 30)
        }
      })
  }

  delay() {
    if (this.state.isLoading) {
      this.delayId = setTimeout(() => {
        this.setState({ isLoading: false })
      }, 960)
    }
  }

  refreshScores(dt, seconds) {
    clearTimeout(this.refreshId)
    this.refreshId = setTimeout(() => this.makeRequest(dt), seconds * 1000)
  }

  render() {
    return <League {...this.state} league={this.props.league} />
  }
}

export default NbaContainer
