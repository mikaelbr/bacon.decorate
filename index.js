!(function (root) {
  'use strict';

  var slice = Function.prototype.call.bind(Array.prototype.slice);
  var decorators = function (Bacon) {
    return {
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
       * when event is triggered on target event
       * with an optional transform.
       */
      event: function (target, fn, transform) {
        return function () {
          return Bacon.fromEventTarget.apply(
            Bacon,
            [call(fn, slice(arguments))].concat([target, transform]));
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