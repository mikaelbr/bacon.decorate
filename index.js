!(function (root) {
  'use strict';

  var slice = Function.prototype.call.bind(Array.prototype.slice);
  var decorators = function (Bacon) {
    return {
      /*
       * Select automaticly the reactive data type wrapping
       * based on returned type.
       *
       * Only for where type is returned in function like:
       * returned promises, arrays, values and eventemitter objects
       */
      autoValue: function (fn) {
        var dArgs = arguments;

        return function () {
          var val = call(fn, slice(arguments));
          var method = getMethodOfReturn(val);
          var args = method !== 'fromEventTarget'
            ? [val].concat(arguments)
            : [val].concat(slice(dArgs, 1))
                .concat(slice(arguments, 1));
          return Bacon[method].apply(Bacon, args);
        };
      },

      /*
       * Returns an event stream with a value
       * when event is triggered on target event
       * with an optional transform.
       */
      event: function (fn, target, transform) {
        return function () {
          return Bacon.fromEventTarget.apply(
            Bacon,
            [call(fn, slice(arguments))].concat([target, transform]));
        };
      },

      /*
       * Returns an event stream with a value
       * when callback is triggered
       */
      callback: function (fn) {
        return function () {
          return Bacon.fromCallback.apply(
            Bacon,
            [fn].concat(slice(arguments)));
        };
      },

      /*
       * Returns an event stream with a value
       * when callback is triggered from node
       * (with error as first argument)
       */
      nodeCallback: function (fn) {
        return function () {
          return Bacon.fromNodeCallback.apply(
            Bacon,
            [fn].concat(slice(arguments)));
        };
      },

      /*
       * Returns an event stream with a value
       * a returned promise either is resolved
       * or rejected.
       */
      promise: function (fn, abort) {
        return function () {
          return Bacon.fromPromise.apply(
            Bacon,
            [call(fn, slice(arguments))].concat([abort]));
        };
      },

      value: valuedDecorator('once'),
      array: valuedDecorator('fromArray'),

      interval: timedDecorator('interval'),
      sequentially: timedDecorator('sequentially'),
      repeatedly: timedDecorator('repeatedly'),
      later: timedDecorator('later'),

      /*
       * Returns an event stream with a value
       * returned from function fn and polled
       * every interval given by argument
       * interval (in ms)
       */
      poll: function (interval, fn) {
        return function () {
          return Bacon.fromPoll.apply(
            Bacon,
            [interval, fn].concat(slice(arguments)));
        };
      }
    };

    function call (fn, args) {
      return fn.apply(fn, args);
    };

    function timedDecorator (method) {
      return function (time, fn) {
        return wrapWithTime(method, time, fn)
      };
    };

    function valuedDecorator (method) {
      return function (fn) {
        return wrap(method, fn)
      };
    };

    function wrapWithTime (method, time, fn) {
      return function () {
        return Bacon[method](time, call(fn, slice(arguments)))
      };
    };

    function wrap (method, fn) {
      return function () {
        return Bacon[method](call(fn, slice(arguments)))
      };
    };

    function getMethodOfReturn (val) {
      if (Array.isArray(val)) {
        return 'fromArray';
      }

      if (typeof val === 'object'
        && (val.on || val.addEventListener || val.bind)) {
        return 'fromEventTarget';
      }

      if (val && typeof val.then === 'function') {
        return 'fromPromise';
      }

      return 'once';
    }
  };

  (function (factory) {
    if (typeof exports === 'object') {
      module.exports = factory(require('baconjs'));
    } else if (typeof define === 'function' && define.amd) {
      define(['baconjs'], function (Bacon) {
        return (root.BaconDecorate = factory(Bacon));
      });
    } else {
      root.BaconDecorate = factory(root.Bacon);
    }
  }(decorators));
}(this));