import React, { Component } from 'react'

import Countdown from 'react-downcount'

export default class App extends Component {
  render () {
    const endDate = new Date()
    endDate.setMinutes(endDate.getMinutes() + 3)

    return <Countdown
      endDate={endDate}
      onCompleted={() => {
        console.log('The countdown has completed')
      }} />
  }
}
