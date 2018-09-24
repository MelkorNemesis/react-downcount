import React, { Component, Fragment } from 'react'

import Countdown, { doubleDigit } from 'react-downcount'

// eslint-disable-next-line
const customRenderer = ({ days, hrs, mins, secs, isCompleted }) => {
  return isCompleted
    ? 'Done'
    : <Fragment>
      {days > 0 && `${days} days `}{hrs} hours {doubleDigit(mins)} minutes {doubleDigit(secs)} seconds
    </Fragment>
}

export default class App extends Component {
  render () {
    const endDate = new Date()
    endDate.setMinutes(endDate.getMinutes() + 5)

    return <Countdown
      endDate={endDate}
      onCompleted={() => {
        console.log('The countdown has completed')
      }}>
      {customRenderer}
    </Countdown>
  }
}
