# Bacon.decorate

> Unify your API and abstract time using Functional Reactive Programming and [Bacon.js](https://github.com/baconjs/bacon.js)

APIs are hard. Sometimes they can have you provide a callback,
other times they return a promise or not even be async. You
can unify the usage of your API and abstract consepts like
sync or async, by using Functional Reactive Programming
and the help of a implementation called [Bacon.js](https://github.com/baconjs/bacon.js).


## Example

```javascript
var decorate = require('bacon.decorate');

var m = {
  get: decorate.promise(function (arg1, arg2) {
    return $.ajax();
  }),

  getAnother: decorate.callback(function (a, b, callback) {
    setTimeout(function () {
      callback(a, b)
    }, 1000);
  })
};

// Wait for both:
m.get('foo', 'bar')
  .zip(m.getAnother('hello', 'world'), '.concat')
  .onValue(function (value) {
    console.log('val', value);
    //= [resultFromAjax, 'hello', 'world'];
  });
```