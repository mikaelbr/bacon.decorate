var decorators = require('./');
var should = require('should');

describe('BaconDecorator', function () {

  it('should return event stream from callback', function (done) {
    var test = decorators.callback(function (a, b, callback) {
      a.should.equal('1');
      b.should.equal('2');
      callback('Hello World');
    });

    test('1', '2').onValue(function (value) {
      value.should.equal('Hello World');
      done();
    });
  });

  it('should return event stream from value', function (done) {
    var test = decorators.value(function (a, b) {
      a.should.equal(1);
      b.should.equal(22);
      return a + b;
    });

    test(1, 22).onValue(function (value) {
      value.should.equal(23);
      done();
    });
  });

  it('should return event stream from arrays', function (done) {
    var test = decorators.array(function (a, b) {
      return [a, b];
    });

    test(1, 22)
      .fold([], '.concat')
      .onValue(function (value) {
        value.should.eql([1, 22]);
        done();
      });
  });

  it('should return event stream from value in intervals', function (done) {
    var test = decorators.interval(1, function (a) {
      return a;
    });

    var data = test('a');
    var i = 0;

    var unsub = data.onValue(function (value) {
      value.should.eql('a');
      if (++i > 5) {
        unsub();
        done();
      }
    });
  });

  it('should return event stream from repeated values', function (done) {
    var expected = ['a', 'b', 'c'];
    var test = decorators.repeatedly(1, function (a, b, c) {
      return [a, b, c];
    });

    var data = test('a', 'b', 'c');
    var i = 0;

    var unsub = data.onValue(function (value) {
      value.should.eql(expected[i]);
      if (++i >= 2) {
        unsub();
        done();
      }
    });
  });

  it('should return event stream from sequentially called array', function (done) {
    var expected = ['a', 'b', 'c'];
    var test = decorators.sequentially(1, function (a, b, c) {
      return [a, b, c];
    });

    var time = new Date().getTime();
    test('a', 'b', 'c')
      .doAction(function () {
        (new Date().getTime() - time).should.be.approximately(1, 2);
        time = new Date().getTime();
      })
      .fold([], '.concat')
      .onValue(function (value) {
        value.should.eql(expected);
        done();
      });
  });

  it('should return event stream with delay', function (done) {
    var expected = ['a', 'b', 'c'];
    var test = decorators.later(1, function (a, b, c) {
      return [a, b, c];
    });

    var time = new Date().getTime();
    test('a', 'b', 'c')
      .onValue(function (value) {
        (new Date().getTime() - time).should.be.approximately(1, 2);
        value.should.eql(expected);
        done();
      });
  });

});