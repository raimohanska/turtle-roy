define(["roy", "lodash", "sandbox"], function(_roy, _, Sandbox) {
  return function RoyEnv() {
    var sandbox = Sandbox()
    var royEvaluator = RoyEvaluator(sandbox.eval)
    var api = {
      royEnv: royEvaluator.royEnv,
      compileRoy: royEvaluator.compileRoy,
      setGlobals: sandbox.setGlobals,
      evalScript: function(scriptName, callback) {
        require(["text!" + scriptName], function(script) {
          royEvaluator.evalRoy(script)
          if (callback) callback()
        })
      },
      evalRoy: function(code) {
        var evaled;
        _(royEvaluator.splitRoy(code)).each(function(line, index) {
          try {
            evaled = royEvaluator.evalRoy(line)
          } catch (e) {
            e.lineNumber = royEvaluator.toSourceLineNumber(code, index)
            throw e
          }
          flattenFunctionValue(evaled)
        })
        return evaled
      },
      evalJs: function(code) {
        var result = sandbox.eval.call(this, code)
        return flattenFunctionValue({ result: result })
      },
      splitRoy: royEvaluator.splitRoy
    }
    api.eval = api.evalRoy
    return api
  }

  function flattenFunctionValue(evaled) {
    if (typeof evaled.result == "function") {
      var result = evaled.result()
      evaled.result = result
    }
    return evaled
  }

  function RoyEvaluator(ctxEval) {
    function indentation(s) { for (var i = 0; i < s.length; i++) { if (s[i] != ' ') return s.slice(0,i) } return "" }
    function removeCommonIndent(s) {
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
      code = removeCommonIndent(code.replace(/^\s*\n/g, ""))
      return roy.compile(code, env, aliases, {nodejs:true})
    }
    function royEnv(term) {
      return env[term]
    }
    function toSourceLineNumber(code, compressedLineIndex) {
      var index = 0
      var uncompressedLines = removeCommonIndent(code).split("\n")
      for (var i = 0; i < uncompressedLines.length; i++) {
        if (index == compressedLineIndex) {
          return i + 1 // convert to 1-based line number
        }
        var line = uncompressedLines[i]
        if (indentation(line).length == 0) {
          index++
        }
      }
      throw new Error("Line number out of bounds: " + compressedLineIndex)
    }
    function splitRoy(code) {
      var result = []
      var lines = removeCommonIndent(code).split("\n")
      var chunkLines = []
      function emitLine() {
        if (chunkLines.length) {
          var chunkCode = chunkLines.join("")
          result.push(chunkCode)
          chunkLines = []
        }
      }
      for (var i in lines) {
        var line = lines[i]
        if (indentation(line).length == 0) {
          emitLine()
        }
        chunkLines.push(line)
      }
      emitLine()
      return result
    }
    var royEvaluator = {
      evalRoy: evalRoy,
      compileRoy: compileRoy,
      royEnv: royEnv,
      splitRoy: splitRoy,
      toSourceLineNumber: toSourceLineNumber
    };
    return royEvaluator;
  }
})
