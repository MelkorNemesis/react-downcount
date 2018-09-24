import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

var ONE_SECOND_IN_MILLISECONDS = 1000;
var ONE_MINUTE_IN_MILLISECONDS = 60 * ONE_SECOND_IN_MILLISECONDS;
var ONE_HOUR_IN_MILLISECONDS = 60 * ONE_MINUTE_IN_MILLISECONDS;
var ONE_DAY_IN_MILLISECONDS = 24 * ONE_HOUR_IN_MILLISECONDS;

function doubleDigit(val) {
  return String(val).padStart(2, '0');
}

/* eslint-disable react/prop-types */

var renderer = function renderer(_ref) {
  var days = _ref.days,
      hrs = _ref.hrs,
      mins = _ref.mins,
      secs = _ref.secs;
  return React.createElement(
    Fragment,
    null,
    days,
    ' days ',
    doubleDigit(hrs),
    ':',
    doubleDigit(mins),
    ':',
    doubleDigit(secs)
  );
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "/* add css styles here (optional) */\n\n.styles_countdown__6MraL {\n  display: inline-block;\n}\n";
var styles = { "countdown": "styles_countdown__6MraL" };
styleInject(css);

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var DEFAULT_STATE = {
  days: 0,
  hrs: 0,
  mins: 0,
  secs: 0,
  timestamp: null,
  isCompleted: false
};

var Countdown = function (_PureComponent) {
  inherits(Countdown, _PureComponent);

  function Countdown() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Countdown);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Countdown.__proto__ || Object.getPrototypeOf(Countdown)).call.apply(_ref, [this].concat(args))), _this), _this.intervalId = null, _this.state = _extends({}, DEFAULT_STATE), _this.init = function () {
      /* istanbul ignore next */
      if (_this.props.endDate) {
        var now = Date.now();
        _this.setState({
          timestamp: _this.constructor.normalize(_this.props.endDate),
          isCompleted: false
        }, function () {
          if (now < _this.state.timestamp) {
            _this.update(now);
            _this.start();
          } else {
            _this.stop({ isCompleted: true });
            _this.complete();
          }
        });
      }
    }, _this.start = function () {
      _this.intervalId = setInterval(_this.tick, 1000);
    }, _this.tick = function () {
      var now = Date.now();
      if (now >= _this.state.timestamp) {
        _this.stop({ isCompleted: true });
        _this.complete();
      } else {
        _this.update(now);
      }
    }, _this.update = function (now) {
      // how much time is left
      var diff = Math.round(_this.state.timestamp - now);
      // round up to the whole seconds
      diff = Math.round(diff / 1000) * 1000;

      var timeLeft = {
        days: 0,
        hrs: 0,
        mins: 0,
        secs: 0
      };

      var _this$props = _this.props,
          useDays = _this$props.useDays,
          useHours = _this$props.useHours,
          useMinutes = _this$props.useMinutes;


      if (useDays && diff >= ONE_DAY_IN_MILLISECONDS) {
        timeLeft.days = Math.floor(diff / ONE_DAY_IN_MILLISECONDS);
        diff -= timeLeft.days * ONE_DAY_IN_MILLISECONDS;
      }
      if (useHours && diff >= ONE_HOUR_IN_MILLISECONDS) {
        timeLeft.hrs = Math.floor(diff / ONE_HOUR_IN_MILLISECONDS);
        diff -= timeLeft.hrs * ONE_HOUR_IN_MILLISECONDS;
      }
      if (useMinutes && diff >= ONE_MINUTE_IN_MILLISECONDS) {
        timeLeft.mins = Math.floor(diff / ONE_MINUTE_IN_MILLISECONDS);
        diff -= timeLeft.mins * ONE_MINUTE_IN_MILLISECONDS;
      }
      timeLeft.secs = Math.round(diff / 1000);

      _this.setState(timeLeft);
    }, _this.stop = function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$isCompleted = _ref2.isCompleted,
          isCompleted = _ref2$isCompleted === undefined ? false : _ref2$isCompleted;

      _this.setState(_extends({}, DEFAULT_STATE, { isCompleted: isCompleted }));
      if (_this.intervalId) {
        clearInterval(_this.intervalId);
        _this.intervalId = null;
      }
    }, _this.complete = function () {
      var onCompleted = _this.props.onCompleted;

      onCompleted && onCompleted();
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Countdown, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.init();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.endDate !== this.props.endDate) {
        this.stop();
        this.init();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.stop();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          endDate = _props.endDate,
          onCompleted = _props.onCompleted,
          useDays = _props.useDays,
          useHours = _props.useHours,
          useMinutes = _props.useMinutes,
          className = _props.className,
          children = _props.children,
          restProps = objectWithoutProperties(_props, ['endDate', 'onCompleted', 'useDays', 'useHours', 'useMinutes', 'className', 'children']);
      var _state = this.state,
          days = _state.days,
          hrs = _state.hrs,
          mins = _state.mins,
          secs = _state.secs,
          isCompleted = _state.isCompleted;


      return React.createElement(
        'div',
        _extends({ className: className || styles.countdown }, restProps),
        children({ days: days, hrs: hrs, mins: mins, secs: secs, isCompleted: isCompleted })
      );
    }
  }]);
  return Countdown;
}(PureComponent);

Countdown.propTypes = {
  endDate: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
  onCompleted: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.func,
  useDays: PropTypes.bool,
  useHours: PropTypes.bool,
  useMinutes: PropTypes.bool
};
Countdown.defaultProps = {
  children: renderer,
  useDays: true,
  useHours: true,
  useMinutes: true
};

Countdown.normalize = function (now) {
  if (now instanceof Date) {
    return +now;
  }
  return now;
};

export default Countdown;
export { doubleDigit };
//# sourceMappingURL=index.es.js.map
