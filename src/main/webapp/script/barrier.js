"use strict";
define([], function() {
  return function barrier(callback, things) {
    var count = things.length
    return {
      countDown: function(x) {
        count--
        if (count == 0 && callback) callback()
      }
    }
  }
})

