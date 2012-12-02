window.royloader = {};
(function() {
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
    return eval.call(this, code);
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
        chunkCode = chunkLines.join("\n")
        result.push(chunkCode)
        chunkLines = []
      }
    }
    for (i in lines) {
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
})();

(function() {
  load = function (url, callback) {
    var xhr = (window.ActiveXObject) ?
      new window.ActiveXObject('Microsoft.XMLHTTP')
      : new XMLHttpRequest()
    xhr.open('GET', url, true)
    if (xhr.overrideMimeType) xhr.overrideMimeType('text/plain')
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 0 || xhr.status == 200)
          royloader.evalRoy (xhr.responseText)
        else
          throw new Error("Could not load " + url)
        if (callback) callback()
      }
    }
    xhr.send(null)
  }

  runScripts = function() {
    var scripts = document.getElementsByTagName('script')
    var roys = []
    for (i in scripts) {
      var s = scripts[i]
      function attr(key) {
        if (s.attributes && s.attributes[key]) 
          return s.attributes[key].value
      }
      if (attr("language") == "roy" || s.type == "text/roy") roys.push(s)
    }
    var index = 0
    var length = roys.length
    execute = function() {
      var script = roys[index++]
      if (script)
        if (script.src) {
          load (script.src, execute)
        } else {
          royloader.evalRoy(script.innerHTML)
          execute()
        }
    }
    execute()
    null
  }

  if (window.addEventListener)
    addEventListener('DOMContentLoaded', runScripts, false)
  else
    attachEvent('onload', runScripts)

})()

