"use strict";
define([], function() {
  return function tco(f) {
    var result, active = false, accumulated = []
    return function accumulator() {
      accumulated.push(arguments)
      if (!active) {
        active = true
        while (accumulated.length) result = f.apply(this, accumulated.shift())
        active = false
        return result
      }
    }
  }
})
