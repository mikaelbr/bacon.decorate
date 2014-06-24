# Bacon.decorate [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> Unify your API and abstract time using Functional Reactive Programming (FRP) and [Bacon.js](https://github.com/baconjs/bacon.js)

APIs are hard. Sometimes they can have you provide a callback,
other times they return a promise or be synchronous. You
can unify the usage of your API and abstract concepts like
sync or async, by using the paradigm Functional Reactive Programming
with the help of a implementation called [Bacon.js](https://github.com/baconjs/bacon.js).

The result of function calls will be reactive data types
from [Bacon.js](https://github.com/baconjs/bacon.js). If you
are unsure how to use Bacon or what FRP is, the
[Bacon.js README](https://github.com/baconjs/bacon.js) is very helpful
and has a comprehensive introduction.

## Example

```javascript
var decorate = require('./');
var Q = require('q');

var API = {

  // Async values using promises
  get: decorate.promise(function (arg1, arg2) {
    // Could be something like $.ajax aswell
    var def = Q.defer();
    setTimeout(function () {
      def.resolve("Async?");
    }, 1000);

    return def.promise;
  }),

  // Async values using callbacks
  getAnother: decorate.callback(function (a, b, callback) {
    setTimeout(function () {
      callback(a + ", " + b)
    }, 1000);
  }),


  // Regular sync values
  sync: decorate.value(function (a, b) {
    return a + ", " + b;
  }),

  // Or using events
  // This is an Event Stream of body content
  // triggered on click
  event: decorate.event('click', function () {
    return document.body;
  }, '.currentTarget.innerHTML')
};
```

By adding decorator to all methods, we can access them
without thinking about if it's async or sync and we
can easily combine them in different ways.

### Example of waiting for multiple data inputs:

```javascript
// Waiting for multiple values (example)
API.get('foo', 'bar')
  .combine(m.getAnother('Foo', 'Bar'), function (a, b) {
    return a + ": " + b;
  })
  .combine(m.sync('Baz', 'Qux'), function (a, b) {
    return a + ", " + b;
  })
  .onValue(function (value) {
    console.log('val', value);
    //=> val Async?: Foo, Bar, Baz, Qux
  });
```

## API

### ```decorate.autoValue```
Automaticly choose wrapping type based on type of value returned
from function. Only works on value type wrapping functions including:
`event`, `promise`, `value` and `array`.

This is useful when you return different types of data in a function.

#### Example

```javascript

var someAPI = decorate.autoValue(function(a) {
  if (someCondintional) {
    return 42;
  }

  if (Array.isArray(a)) {
    return a;
  }

  if (someOtherConditional) {
    // 'click' is passed as event type
    // through second argument to autoValue
    return document.body;
  }

  return $.ajax({
    url: '/async/call/here?' + $.params(a)
  });
}, 'click');

// Logs the result of an ajax call.
// No need to check for sync values
someApi({ id : 1 }).log();

```


### ```decorate.callback```
More info soon

See [Bacon.js `.fromCallback()`](https://github.com/baconjs/bacon.js#bacon-fromcallback)

### ```decorate.nodeCallback```
More info soon

See [Bacon.js `.fromNodeCallback()`](https://github.com/baconjs/bacon.js#bacon-fromnodecallback)


### ```decorate.event(fn, eventName[, transformFunction])```

Wraps event returned from `fn` on `eventName` channel. You can
pass in an optional transform function to transform the event object
returned from the `fn` function.

See [Bacon.js `.fromEventTarget()`](https://github.com/baconjs/bacon.js#bacon-fromeventtarget)

### ```decorate.promise(fn, abort)```

Wraps promise returned from `fn` as a reactive data type.
`abort` defines if `.abort` method should be called on promise
when all subscribers of event stream is removed.

See [Bacon.js `.fromPromise()`](https://github.com/baconjs/bacon.js#bacon-frompromise)

### ```decorate.value(fn)```

Wraps primitive value returned from `fn` as a reactive data type.

See [Bacon.js `.once()`](https://github.com/baconjs/bacon.js#bacon-once)

### ```decorate.array(fn)```

Wraps an array returned from `fn` as a reactive data type.
The result is an event stream that gives a value for each
of the entries in the array.

See [Bacon.js `.fromArray()`](https://github.com/baconjs/bacon.js#bacon-fromarray)

### ```decorate.interval(interval, fn)```

Wraps to an event stream that gives value returned from `fn`
every ms defined by `interval`.

See [Bacon.js `.interval()`](https://github.com/baconjs/bacon.js#bacon-interval)


### ```decorate.sequentially(interval, fn)```

Wraps to an event stream that gives value for each item
every ms defined by `interval` from an array returned from `fn`.

See [Bacon.js `.sequentially()`](https://github.com/baconjs/bacon.js#bacon-sequentially)


### ```decorate.repeatedly(interval, fn)```

Same as ```decorate.sequentially(interval, fn)```, but starting from first
item in the returned array when the end is reached, instead of ending.

See [Bacon.js `.repeatedly()`](https://github.com/baconjs/bacon.js#bacon-repeatedly)


### ```decorate.later(delay, fn)```

Gives an event stream that gives a value returned from `fn` after
`delay` milliseconds.

See [Bacon.js `.later()`](https://github.com/baconjs/bacon.js#bacon-later)


### ```decorate.poll(interval, fn)```

Returns an event stream with values from polling `fn` every `interval` milliseconds.

See [Bacon.js `.fromPoll()`](https://github.com/baconjs/bacon.js#bacon-frompoll)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[![NPM downloads][npm-downloads]][npm-url]

[npm-url]: https://npmjs.org/package/bacon.decorate
[npm-image]: http://img.shields.io/npm/v/bacon.decorate.svg?style=flat
[npm-downloads]: http://img.shields.io/npm/dm/bacon.decorate.svg?style=flat

[travis-url]: http://travis-ci.org/mikaelbr/bacon.decorate
[travis-image]: http://img.shields.io/travis/mikaelbr/bacon.decorate.svg?style=flat

[depstat-url]: https://gemnasium.com/mikaelbr/bacon.decorate
[depstat-image]: http://img.shields.io/gemnasium/mikaelbr/bacon.decorate.svg?style=flat


