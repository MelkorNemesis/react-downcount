/* eslint-disable react/prop-types */

import React, { Fragment } from 'react'
import { doubleDigit } from './utils'

const renderer = ({ days, hrs, mins, secs }) =>
  <Fragment>{days} days {doubleDigit(hrs)}:{doubleDigit(mins)}:{doubleDigit(secs)}</Fragment>

export default renderer
