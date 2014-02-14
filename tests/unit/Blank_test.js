'use strict';

module.exports = {
  setUp: function(callback) {
    callback();
  },

  tearDown: function(callback) {
    callback();
  },

  testSpike: function(test) {
    test.ok(true, 'Works on my machine!');
    test.done();
  }
};