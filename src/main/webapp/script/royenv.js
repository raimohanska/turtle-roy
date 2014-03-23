define(["royloader", "roy"], function(royloader) {
  return function RoyEnv() { return {
    royEnv: royloader.royEnv,
    compileRoy: royloader.compileRoy,
    evalRoy: function(code) {
      var evaled;
      _(royloader.splitRoy(code)).each(function(line) {
        evaled = royloader.evalRoy(line)
        if (typeof evaled.result == "function") {
          var result = evaled.result()
          evaled.result = result
        }
      })
      return evaled
    }
  }}
})
