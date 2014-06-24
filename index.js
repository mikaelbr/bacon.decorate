var Bacon = require('baconjs');
var slice = Function.prototype.call.bind(Array.prototype.slice);

module.exports = {
  callback: function (fn) {
    return function () {
      return Bacon.fromCallback.apply(
        Bacon,
        [fn].concat(slice(arguments)));
    };
  },

  value: valuedDecorator('once'),
  array: valuedDecorator('fromArray'),

  interval: timedDecorator('interval'),
  sequentially: timedDecorator('sequentially'),
  repeatedly: timedDecorator('repeatedly'),
  later: timedDecorator('later'),


  event: function (target, fn, transform) {
    return function () {
      return Bacon.fromEventTarget.apply(
        Bacon,
        [call(fn, slice(arguments))].concat([target, transform]));
    };
  },

  promise: function (fn) {
    throw new Error('Not implemented yet');
    // return function () {
    //   return Bacon.fromPromise(call(fn, arguments));
    // };
  },

  poll: function (interval, fn) {
    return function () {
      return Bacon.fromPoll.apply(
        Bacon,
        [interval, fn].concat(slice(arguments)));
    };
  }
};

function exceptFirst (args, i) {
  i = i || 1;
  return slice(args, i);
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

