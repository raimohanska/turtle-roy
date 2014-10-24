"use strict";
define(["bacon","jq-console"], function(Bacon) {
  var welcomeMessage = "Welcome to Turtle Roy.\nTry this: repeat 360 (sequence[fd 1, lt 1])\nOr try one of the examples below.\n"
  var promptLabel = 'λ> '
  function fmt(value, className) {
    return {msg: value, className: "jqconsole-" + className};
  }

  function fmtValue(value) { return fmt(value, "value"); }
  function fmtType(value) { return fmt(value, "type"); }
  function fmtCommand(value) { return fmt(promptLabel + value, "command"); }
  function fmtError(value) { 
    if (value.statusText) {
      value = value.statusText
    }
    return fmt(value, "error"); 
  }

  function init(consoleElement, roy) {
    var history = new Bacon.Bus()
    var error = new Bacon.Bus()
    var skipHistory
    var cs = consoleElement.jqconsole(welcomeMessage, promptLabel)
    setInterval(function() {$(".jqconsole-cursor").toggleClass("blink")}, 500)
    var evalLine = evalRoy
    function sendToConsole(msg) {
      cs.Write(msg.msg + '\n', msg.className);
    }
    function evalRoy(line) {
      var parts = line.split(" ");

      switch (parts[0]) {
      case ":t":
        var term = parts[1]
        var env = roy.royEnv(term)
        if (env) {
          return Bacon.once(fmtType(env));
        } else {
          return Bacon.once(fmtError(term + " is not defined."));
        }

      case ":c":
        try {
          var code = parts.slice(1).join(" ");
          var compiled = roy.compileRoy(code)
          return Bacon.once(fmt(compiled.output, "code"));
        } catch(e) {
          return Bacon.once(fmtError(e.toString()));
        }
      default:
        if (line == ":js") {
          evalLine = evalJs
          return Bacon.once(fmtValue("Javascript mode!"))
        } else {
          return evalUsing(line, roy.evalRoy)
        }
      }
    }

    function evalJs(line) {
        if (line == ":roy") {
          evalLine = evalRoy
          return Bacon.once(fmtValue("Roy mode!"))
        } else {
          return evalUsing(line, roy.evalJs)
        }
    }

    function evalUsing(line, evalFunc) {
      try {
        var evaled = evalFunc(line)
        if (skipHistory) {
          skipHistory = false
        } else {
          history.push(line)
        }
        error.push("")
        if (evaled != undefined && evaled.result != null) {
          console.log("got", evaled)
          return Bacon.once().flatMap(evaled.result)
            .map(function(result) { return fmtValue(JSON.stringify(result))});
        } else {
          return Bacon.never();
        }
      } catch(e) {
        var msg = fmtError(e.toString())
        error.push(msg.msg)
        return Bacon.once(msg);
      }
    }
    function prompt() {
      cs.Prompt(true, function(line) {
        var response = evalLine(line)
        response.onValue(sendToConsole)
        response.errors().mapError(fmtError).onValue(sendToConsole)
        response.onEnd(prompt)
      })  
    }
    prompt()
    return {
      history: history,
      paste: function(text) {
        Bacon.sequentially(200, roy.splitRoy(text)).filter(nonEmpty).onValue(function(line) {
          sendToConsole(fmtCommand(line))
          evalLine(line).onValue(sendToConsole)
        })
      },
      error: error.toProperty(),
      skipHistory: function() {
        skipHistory = true
      },
      focus: function() {
        cs.Focus()
      },
      print: function(text) {
        sendToConsole(fmtValue(text))
      },
      prompt: function(text, handler) {
        sendToConsole(fmt(text, "command"))
        cs.Prompt(true, function(line) {
          handler(line)
        })
      }
    }
  }

  return {
    init: function(element, roy) { return init(element, roy) }
  }
})
