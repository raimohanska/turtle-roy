"use strict";
define(["royloader", "roy", "lodash"], function(royloader, roy, _) {
  return {
    royEnv: royloader.royEnv,
    compileRoy: royloader.compileRoy,
    evalScript: function(scriptName, env, callback) {
      require(["text!" + scriptName], function(script) {
        _.forEach(env, function(value, key) { 
          window[key] = value 
        }) // <- not very nice to export to window, sry
        royloader.evalRoy(script)
        if (callback) callback()
      })
    },
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
  }
})
