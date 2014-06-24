var Bacon = require('baconjs');
var slice = Function.prototype.call.bind(Array.prototype.slice);

module.exports = {
  callback: function (fn) {
    return function () {
      return Bacon.fromCallback.apply(Bacon, [fn].concat(slice(arguments)));
    };
  },

  value: function (fn) {
    return function () {
      return Bacon.once(call(fn, slice(arguments)))
    };
  },

  interval: intervalMethod('interval'),
  sequentially: intervalMethod('sequentially'),
  repeatedly: intervalMethod('repeatedly'),
  later: intervalMethod('later'),

  array: function (fn) {
    return function () {
      return Bacon.fromArray(call(fn, slice(arguments)))
    };
  },

  event: function (target, fn) {
    throw new Error('Not implemented yet');
  },

  promise: function (fn) {
    throw new Error('Not implemented yet');
    // return function () {
    //   return Bacon.fromPromise(call(fn, arguments));
    // };
  },

  poll: function (interval, fn) {
    throw new Error('Not implemented yet');
    // return function () {
    //   return Bacon.fromPoll.apply(Bacon, [interval, fn].concat(slice(arguments)));
    // };
  }
};

function exceptFirst (args, i) {
  i = i || 1;
  return slice(args, i);
};

function call (fn, args) {
  return fn.apply(fn, args);
};

function intervalMethod (method) {
  return function (interval, fn) {
    return wrapWithInterval(method, interval, fn)
  };
};

function wrapWithInterval (method, interval, fn) {
  return function () {
    return Bacon[method](interval, call(fn, slice(arguments)))
  };
};