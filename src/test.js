// ------------------- imports & setup

import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import React from 'react'

import Countdown, { doubleDigit } from './'

configure({ adapter: new Adapter() })

// ------------------- utils

const mock = (obj, fn, mockFn) => {
  const originalFn = obj[fn]
  obj[fn] = mockFn
  return () => {
    obj[fn] = originalFn
  }
}

// ------------------- tests

describe('<Countdown />', () => {
  it('is truthy', () => {
    expect(Countdown).toBeTruthy()
  })

  it('calls stop() when unmounting', () => {
    const wrapper = shallow(<Countdown endDate={Date.now()} />)
    const instance = wrapper.instance()
    instance.stop = jest.fn()
    wrapper.unmount()

    expect(instance.stop).toHaveBeenCalled()
  })

  it('calls start() before mounting', () => {
    class CountdownInitTest extends Countdown {
      init = jest.fn()
    }
    const wrapper = shallow(<CountdownInitTest endDate={Date.now()} />)
    const instance = wrapper.instance()

    expect(instance.init).toHaveBeenCalled()
  })

  it('reinitializes when different endDate prop is received', () => {
    class CountdownInitTest extends Countdown {
      init = jest.fn()
      stop = jest.fn()
    }

    const wrapper = shallow(<CountdownInitTest endDate={Date.now()} />)
    wrapper.setProps({ endDate: Date.now() + 10 })

    const instance = wrapper.instance()
    expect(instance.stop).toHaveBeenCalled()
    expect(instance.init).toHaveBeenCalled()
  })

  describe('onCompleted()', () => {
    it('is called immediatelly when endDate is set to now', () => {
      const onCompleted = jest.fn()
      shallow(<Countdown endDate={Date.now()} onCompleted={onCompleted} />)

      expect(onCompleted).toHaveBeenCalled()
    })

    it('is called immediatelly when endDate is set to time in the past', () => {
      const onCompleted = jest.fn()
      shallow(<Countdown endDate={Date.now() - 1000} onCompleted={onCompleted} />)

      expect(onCompleted).toHaveBeenCalled()
    })

    it('is called when endDate is reached', () => {
      jest.useFakeTimers()

      const onCompleted = jest.fn()
      const endDate = Date.now() + 150
      shallow(<Countdown endDate={endDate} onCompleted={onCompleted} />)

      expect(onCompleted).not.toHaveBeenCalled()
      jest.runAllTimers()
      expect(onCompleted).toHaveBeenCalled()
    })

    afterAll(() => {
      jest.restoreAllTimers()
    })
  })

  describe('normalize()', () => {
    it('converts Date object to unix timestamp', () => {
      const christmasDate = new Date('2018-12-24')
      const christmasTimestamp = 1545609600000
      expect(Countdown.normalize(christmasDate)).toEqual(christmasTimestamp)
    })

    it('does not modify value if number is passed', () => {
      const christmasTimestamp = 1545609600000
      expect(Countdown.normalize(christmasTimestamp)).toEqual(christmasTimestamp)
    })
  })

  describe('init()', () => {
    it('calls update() and start() when endDate passed and now < endDate', () => {
      // setup
      const endDate = new Date('2018-12-24 12:00:00')
      const endDatePlusTenMinutes = new Date('2018-12-24 12:10:00')
      const restoreDateNow = mock(global.Date, 'now', () => {
        return endDatePlusTenMinutes
      })
      class CountdownInitTest extends Countdown {
        update = jest.fn()
        start = jest.fn()
      }

      // given that
      const wrapper = shallow(<CountdownInitTest endDate={endDate} />)
      const instance = wrapper.instance()
      instance.init()

      // expect
      // because init() calls setState() which is async
      setTimeout(() => {
        expect(instance.update).toHaveBeenCalled()
        expect(instance.start).toHaveBeenCalled()
      }, 0)

      // cleanup
      restoreDateNow()
    })

    it('calls complete() when endDate passed and now >= endDate', () => {
      // setup
      const endDate = new Date('2018-12-24 12:00:00')
      const endDateMinusTenMinutes = new Date('2018-12-24 11:50:00')
      const restoreDateNow = mock(global.Date, 'now', () => {
        return endDateMinusTenMinutes
      })
      class CountdownInitTest extends Countdown {
        complete = jest.fn()
      }

      // given that
      const wrapper = shallow(<CountdownInitTest endDate={endDate} />)
      const instance = wrapper.instance()
      instance.init()

      // expect
      // because init() calls setState() which is async
      setTimeout(() => {
        expect(instance.complete).toHaveBeenCalled()
      }, 0)

      // cleanup
      restoreDateNow()
    })
  })

  describe('start()', () => {
    it('starts the interval timer with 1000ms steps', () => {
      const restoreSetInterval = mock(global, 'setInterval', jest.fn())

      const wrapper = shallow(<Countdown endDate={Date.now()} />)
      const instance = wrapper.instance()
      instance.start()
      expect(setInterval).toHaveBeenCalledWith(instance.tick, 1000)

      restoreSetInterval()
    })
  })

  describe('tick()', () => {
    const endDate = new Date('2018-12-24 12:00:00')

    it('calls update() when now < endDate', () => {
      // setup
      const endDateMinus10Minutes = 1545648600000
      class CountdownTickTest extends Countdown {
        update = jest.fn()
      }

      // given that
      const wrapper = shallow(<CountdownTickTest endDate={endDate} />)
      const instance = wrapper.instance()
      const restoreDateNow = mock(global.Date, 'now', () => {
        return endDateMinus10Minutes
      })
      instance.tick()

      // expect
      expect(instance.update).toHaveBeenCalled()

      // cleanup
      restoreDateNow()
    })

    it('calls stop() & complete() when now >= endDate', () => {
      // setup
      const endDatePlus10Minutes = 1545649800000
      class CountdownTickTest extends Countdown {
        stop = jest.fn()
        complete = jest.fn()
      }

      // given that
      const wrapper = shallow(<CountdownTickTest endDate={endDate} />)
      const instance = wrapper.instance()
      const restoreDateNow = mock(global.Date, 'now', () => {
        return endDatePlus10Minutes
      })
      instance.tick()

      // expect
      expect(instance.stop).toHaveBeenCalled()
      expect(instance.complete).toHaveBeenCalled()

      // cleanup
      restoreDateNow()
    })
  })

  describe('update()', () => {
    let instance
    let wrapper
    let updateFn
    const endDate = new Date('2018-12-24 12:00:00').getTime()

    beforeAll(() => {
      wrapper = shallow(<Countdown endDate={endDate} />)
      instance = wrapper.instance()
      updateFn = instance.update
      instance.setState = jest.fn()
    })

    it('calculates days, hrs, mins, secs properties properly', () => {
      let nowDate = new Date('2018-12-22 10:20:15').getTime()
      updateFn(nowDate)
      expect(instance.setState).toHaveBeenLastCalledWith({
        days: 2,
        hrs: 1,
        mins: 39,
        secs: 45
      })

      nowDate = new Date('2018-12-24 10:22:15').getTime()
      updateFn(nowDate)
      expect(instance.setState).toHaveBeenLastCalledWith({
        days: 0,
        hrs: 1,
        mins: 37,
        secs: 45
      })
    })

    it('handles useDays=false properly', () => {
      wrapper.setProps({ useDays: false })

      let nowDate = new Date('2018-12-22 10:20:15').getTime()
      updateFn(nowDate)
      expect(instance.setState).toHaveBeenLastCalledWith({
        days: 0,
        hrs: 49,
        mins: 39,
        secs: 45
      })
    })

    it('handles useHours=false properly', () => {
      wrapper.setProps({ useDays: true, useHours: false, useMinutes: true })

      let nowDate = new Date('2018-12-22 08:20:15').getTime()
      updateFn(nowDate)
      expect(instance.setState).toHaveBeenLastCalledWith({
        days: 2,
        hrs: 0,
        mins: 219,
        secs: 45
      })
    })

    it('handles useMinutes=false properly', () => {
      wrapper.setProps({ useDays: true, useHours: true, useMinutes: false })

      let nowDate = new Date('2018-12-22 08:20:15').getTime()
      updateFn(nowDate)
      expect(instance.setState).toHaveBeenLastCalledWith({
        days: 2,
        hrs: 3,
        mins: 0,
        secs: 2385
      })
    })

    it('handles useDays=false & useHours=false & useMinutes=false properly', () => {
      wrapper.setProps({ useDays: false, useHours: false, useMinutes: false })

      let nowDate = new Date('2018-12-22 08:20:15').getTime()
      updateFn(nowDate)
      expect(instance.setState).toHaveBeenLastCalledWith({
        days: 0,
        hrs: 0,
        mins: 0,
        secs: 185985
      })
    })
  })

  describe('render()', () => {
    let restoreMockDateNow

    beforeAll(() => {
      const now = new Date('2018-12-23')
      restoreMockDateNow = mock(global.Date, 'now', () => now)
    })

    it('renders correctly', () => {
      const endDate = new Date('2018-12-24')
      const wrapper = shallow(<Countdown endDate={endDate} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('can be passed custom renderer', () => {
      const endDate = new Date('2018-12-24')
      const wrapper = shallow(<Countdown endDate={endDate}>{({days, hrs, mins, secs}) => {
        return `${days} päivää ${hrs} tuntia ${mins} minuuttia ${secs} sekuntia`
      }}</Countdown>)
      expect(wrapper).toMatchSnapshot()
    })

    afterAll(() => {
      restoreMockDateNow()
    })
  })

  describe('doubleDigit()', () => {
    it('adds leading digit properly', () => {
      expect(doubleDigit(2)).toEqual('02')
      expect(doubleDigit(22)).toEqual('22')
      expect(doubleDigit(222)).toEqual('222')
    })
  })
})
