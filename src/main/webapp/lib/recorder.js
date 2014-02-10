function Recorder(api) {
  var calls = []
  var recorder = {}
  for (key in api) {
    var f = api[key]
    if (typeof f == "function") {
      recorder[key] = proxyMethod(key, f)
    }
  }
  recorder.calls = calls
  return recorder

  function proxyMethod(key, f) {
      return function() {
        calls.push({key: key, args: Array.prototype.slice.call(arguments)})
        return f.apply(api, arguments)
      }
  }
}
