function Recorder(api) {
  var calls = []
  var recorder = {}
  for (key in api) {
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
    }
  }
  return recorder

  function proxyMethod(key, f) {
      return function() {
        calls.push([key, Array.prototype.slice.call(arguments)])
        return f.apply(api, arguments)
      }
  }
}
