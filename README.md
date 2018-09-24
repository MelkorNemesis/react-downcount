# react-downcount

> React countdown component

[![NPM](https://img.shields.io/npm/v/react-downcount.svg)](https://www.npmjs.com/package/react-downcount) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-downcount
```
or
```bash
yarn add react-downcount
```

## Demo

See live demo at [codesandbox.io](https://codesandbox.io/s/7yrpmk8lq6).

## Usage

### Import
```jsx harmony
import Countdown, { doubleDigit } from 'react-downcount'
```

### Props

|Prop|Required|Default|Example|Description|
|---|---|---|---|---|
|`endDate`|**yes**|-|`1537637481962` - unix timestamp<br>or<br>`new Date('...')` - Date object|Unix timestamp or `Date` object that sets the moment in time the Countdown is finished|
|`onCompleted`|no|-|`() => console.log('The countdown has completed')`|Callback being invoked when the Countdown has reached its end|
|`useDays`|no|`true`|`true` / `false`|If `false`, the remaining days are recalculated to hours, see more in examples section|
|`useHours`|no|`true`|`true` / `false`|If `false`, the remaining horus are recalculated to minutes, see more in examples section|
|`useMinutes`|no|`true`|`true` / `false`|If `false`, the remaining minutes are recalculated to seconds, see more in examples section|
|`className`|no|-|`string`|`<Countdown />`'s wrapper className|
|`children`|no|`defaultRenderer`|`({ days, hrs, mins, secs, isCompleted }) => { ... }`|If passed, `children` can only be a function that is used as a render callback to create custom `<Countdown />` renderer|


### Examples

#### 1. Default renderer

```jsx harmony
const endDate = new Date('2020-12-24') // Christmas, yay
<Countdown endDate={endDate} /> 
```
produces e.g.
`823 days 06:19:01`

#### 2. Custom renderer
You can use the custom renderer to create arbitrary countdown outputs. You can control rendering each property based on it's value or create language mutations.
Each custom renderer is passed the following object `{ days, hrs, mins, secs, isCompleted }`.

```jsx harmony
const endDate = new Date('2020-12-24') // Christmas, yay
const countdownRenderer = ({ days, hrs, mins, secs, isCompleted }) => {
  return isCompleted
      ? 'Done'
      : <Fragment>{days > 0 && `${days} days `}{hrs} hours {doubleDigit(mins)} minutes {doubleDigit(secs)} seconds</Fragment>
}
<Countdown endDate={endDate} /> 
```

produces e.g. `823 days 6 hours 15 minutes 37 seconds` or `6 hours 15 minutes 37 seconds` 

`react-downcount` package exports `doubleDigit` function that comes in handy when you want hour/minute/second values padded with leading zero. Just import it like so `import { doubleDigit } from 'react-downcount'`

#### 3. onCompleted callback

Pass a callback as an `onCompleted` property that gets invoked when the countdown ends.

```jsx harmony
<Countdown endDate={...} onCompleted={() => {
  console.log('The countdown has finished')
}} /> 
```

#### 4. useDays, useHours, useMinutes

You may wish not to convert hours to days / minutes to hours / seconds to minutes. You can control this behaviour with `useDays`, `useHours` and `useMinutes` props.

e.g.
```jsx harmony
<Countdown endDate={...} useDays={false} /> 
```
may produce `55 hours 30 minutes 19 seconds` instead of `2 days 7 hours 30 minutes 19 seconds`

The same goes for `useHours` and `useMinutes` properties. These can be combined arbitrarily.


#### 5. Custom className & props

You can pass `className` and all other properties to the `<Countdown />` component.
e.g.
```jsx harmony
<Countdown endDate={...} className="my-custom-class" onClick={(e) => { ... }} /> 
```

#### 6. Setting up endDate

Javascript already comes with a pretty good set of functions that allow you easily set an `endDate`.
Say you want the `<Countdown />` to expire 3 hours in the future.

You can do it as follows:
```jsx harmony
const endDate = new Date()
endDate.setHours(endDate.getHours() + 3)
``` 

The beauty of it is that if it's 23:00 (11 PM) and you do this, it sets the hours to 2:00 (2 AM), but also increments the day.
Same way if you do e.g.

```jsx harmony
const endDate = new Date()
endDate.setMinutes(endDate.getMinutes() + 100)
``` 

it adds 1 hour and 40 minutes to the endDate.

or you can just use current timestamp and add for instance 5 minutes manually, like so

```jsx harmony
const endDate = Date.now() + 1000 * 60 * 5
``` 

## License

MIT © [MelkorNemesis](https://github.com/MelkorNemesis)
