import React, { Component, Fragment } from 'react'

import Countdown, { doubleDigit } from 'react-downcount'

// eslint-disable-next-line
const customRenderer = ({ days, hrs, mins, secs }) => {
  return <Fragment>{days > 0 && `${days} days `} {`${hrs} h`} {`${doubleDigit(mins)} m`} {`${doubleDigit(secs)} s`}</Fragment>
}

export default class App extends Component {
  render () {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 1)
    endDate.setSeconds(endDate.getSeconds() + 20)

    return <Countdown
      endDate={endDate}
      onCompleted={() => {
        console.log('The countdown has completed')
      }}>
      {customRenderer}
    </Countdown>
  }
}
