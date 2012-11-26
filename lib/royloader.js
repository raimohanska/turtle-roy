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
  royloader.evalRoy = evalRoy
  royloader.compileRoy = compileRoy
  royloader.royEnv = royEnv
})()

$(function() {
  $("script[language=roy]").each(function(i, scriptTag) {
    var element = $(scriptTag)
    var url = element.attr("src")
    if (url) {
      console.log("src attribute not supported yet")
    } else {
      royloader.evalRoy(element.html())
    }
  })
})

