"use strict";
define([], function() {
  return function Recorder(api) {
    var calls = []
    var recorder = {}
    for (var key in api) {
      var f = api[key]
      if (typeof f == "function") {
        recorder[key] = proxyMethod(key, f)
      }
    }
    recorder._recorder = {
      calls: function() {
        return calls
      },
      reset: function() {
        calls = []
      },
    }
    recorder.export = recorder._recorder.calls
    return recorder

    function proxyMethod(key, f) {
        return function() {
          if (key != "spin") {
            calls.push([key, Array.prototype.slice.call(arguments)])
          }
          return f.apply(api, arguments)
        }
    }
  }
})
