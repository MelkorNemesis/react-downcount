import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import {
  ONE_MINUTE_IN_MILLISECONDS,
  ONE_HOUR_IN_MILLISECONDS,
  ONE_DAY_IN_MILLISECONDS
} from './consts'
import defaultRenderer from './renderer'

import styles from './styles.css'

const DEFAULT_STATE = {
  days: 0,
  hrs: 0,
  mins: 0,
  secs: 0,
  timestamp: null,
  isCompleted: false
}

export default class Countdown extends PureComponent {
  static propTypes = {
    endDate: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.instanceOf(Date)
    ]).isRequired,
    onCompleted: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.func,
    useDays: PropTypes.bool,
    useHours: PropTypes.bool,
    useMinutes: PropTypes.bool
  }

  static defaultProps = {
    children: defaultRenderer,
    useDays: true,
    useHours: true,
    useMinutes: true
  }

  static normalize = (now) => {
    if (now instanceof Date) {
      return +now
    }
    return now
  }

  intervalId = null
  state = { ...DEFAULT_STATE }

  componentWillMount() {
    this.init()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.endDate !== this.props.endDate) {
      this.stop()
      this.init()
    }
  }

  componentWillUnmount() {
    this.stop()
  }

  init = () => {
    /* istanbul ignore next */
    if (this.props.endDate) {
      const now = Date.now()
      this.setState({
        timestamp: this.constructor.normalize(this.props.endDate),
        isCompleted: false
      }, () => {
        if (now < this.state.timestamp) {
          this.update(now)
          this.start()
        } else {
          this.stop({ isCompleted: true })
          this.complete()
        }
      })
    }
  }

  start = () => {
    this.intervalId = setInterval(this.tick, 1000)
  }

  tick = () => {
    const now = Date.now()
    if (now >= this.state.timestamp) {
      this.stop({ isCompleted: true })
      this.complete()
    } else {
      this.update(now)
    }
  }

  update = (now) => {
    // how much time is left
    let diff = Math.round((this.state.timestamp - now))
    // round up to the whole seconds
    diff = Math.round(diff / 1000) * 1000

    const timeLeft = {
      days: 0,
      hrs: 0,
      mins: 0,
      secs: 0
    }

    const { useDays, useHours, useMinutes } = this.props

    if (useDays && diff >= ONE_DAY_IN_MILLISECONDS) {
      timeLeft.days = Math.floor(diff / ONE_DAY_IN_MILLISECONDS)
      diff -= timeLeft.days * ONE_DAY_IN_MILLISECONDS
    }
    if (useHours && diff >= ONE_HOUR_IN_MILLISECONDS) {
      timeLeft.hrs = Math.floor(diff / ONE_HOUR_IN_MILLISECONDS)
      diff -= timeLeft.hrs * ONE_HOUR_IN_MILLISECONDS
    }
    if (useMinutes && diff >= ONE_MINUTE_IN_MILLISECONDS) {
      timeLeft.mins = Math.floor(diff / ONE_MINUTE_IN_MILLISECONDS)
      diff -= timeLeft.mins * ONE_MINUTE_IN_MILLISECONDS
    }
    timeLeft.secs = Math.round(diff / 1000)

    this.setState(timeLeft)
  }

  stop = ({ isCompleted = false } = {}) => {
    this.setState({ ...DEFAULT_STATE, isCompleted })
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  complete = () => {
    const { onCompleted } = this.props
    onCompleted && onCompleted()
  }

  render() {
    const {
      endDate,
      onCompleted,
      useDays,
      useHours,
      useMinutes,
      className,
      children,
      ...restProps
    } = this.props

    const { days, hrs, mins, secs, isCompleted } = this.state

    return (
      <div className={className || styles.countdown} {...restProps}>
        {children({ days, hrs, mins, secs, isCompleted })}
      </div>
    )
  }
}

export { doubleDigit } from './utils'
