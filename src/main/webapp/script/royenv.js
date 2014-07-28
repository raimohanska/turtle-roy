define(["roy", "lodash", "sandbox"], function(_roy, _, Sandbox) {
  return function RoyEnv() {
    var sandbox = Sandbox()
    var royloader = RoyEvaluator(sandbox.eval)
    return {
      royEnv: royloader.royEnv,
      compileRoy: royloader.compileRoy,
      setGlobals: sandbox.setGlobals,
      evalScript: function(scriptName, callback) {
        require(["text!" + scriptName], function(script) {
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
      },
      splitRoy: royloader.splitRoy
    }
  }

  function RoyEvaluator(ctxEval) {
    var royloader = {};
    function indentation(s) { for (var i = 0; i < s.length; i++) { if (s[i] != ' ') return s.slice(0,i) } return "" }
    function removeIndent(s) {
      var indent = indentation(s)
      var firstLine = new RegExp("^" + indent)
      var otherLines = new RegExp("\n" + indent, "g")
      return s.replace(firstLine, "").replace(otherLines, "\n").replace(/\n\s*$/, "")
    }
    var env = {};
    var aliases = {};
    function eval_(code) {
      return ctxEval.call(this, code);
    }
    function evalRoy(code) {
      var compiled = compileRoy(code)
      compiled.result = eval_(compiled.output)
      return compiled
    }
    function compileRoy(code) {
      code = removeIndent(code.replace(/^\s*\n/g, ""))
      return roy.compile(code, env, aliases, {nodejs:true})
    }
    function royEnv(term) {
      return env[term]
    }
    function splitRoy(code) {
      var result = []
      var lines = removeIndent(code).split("\n")
      var chunkLines = []
      function spit() {
        if (chunkLines.length) {
          var chunkCode = chunkLines.join("\n")
          result.push(chunkCode)
          chunkLines = []
        }
      }
      for (var i in lines) {
        var line = lines[i]
        if (indentation(line).length == 0) {
          spit()
        }
        chunkLines.push(line)
      }
      spit()
      return result
    }
    royloader.evalRoy = evalRoy
    royloader.compileRoy = compileRoy
    royloader.royEnv = royEnv
    royloader.splitRoy = splitRoy
    return royloader;
  }
})
