"use strict";
define(["bacon", "jquery.console"], function(Bacon) {
  function fmt(value, className) {
    return {msg: value, className: "jquery-console-message-" + className};
  }

  function fmtValue(value) { return fmt(value, "value"); }
  function fmtType(value) { return fmt(value, "type"); }
  function fmtError(value) { return fmt(value, "error"); }

  function init(consoleElement, roy) {
    var history = new Bacon.Bus()
    var error = new Bacon.Bus()
    var sendToConsole;
    var skipHistory

    setTimeout(function() {
      setInterval(function() {$(".jquery-console-cursor").toggleClass("blink")}, 500)
    }, 2500)
    var controller = consoleElement.console({
      promptLabel: 'λ> ',
      autofocus: true,
      animateScroll: true,
      promptHistory: true,
      welcomeMessage: "Welcome to Turtle Roy.\nTry this: repeat 360 (sequence[fd 1, lt 1])\nOr try one of the examples below.",

      commandValidate: function(line) {
        return line != "";
      },

      commandHandle: function (line, report) {
        sendToConsole = report
        var parts = line.split(" ");

        switch (parts[0]) {
        case ":t":
          var term = parts[1]
          var env = roy.royEnv(term)
          if (env) {
            return [fmtType(env)];
          } else {
            return [fmtError(term + " is not defined.")];
          }

        case ":c":
          try {
            var code = parts.slice(1).join(" ");
            var compiled = roy.compileRoy(code)
            return [fmt(compiled.output, "code")];
          } catch(e) {
            return [fmtError(e.toString())];
          }

        default:
          try {
            var evaled = roy.evalRoy(line);
            if (skipHistory) {
              skipHistory = false
            } else {
              history.push(line)
            }
            error.push("")
            if (evaled != undefined && evaled.result != null) {
              return [fmtValue(JSON.stringify(evaled.result))];
            } else {
              return true;
            }
          } catch(e) {
            var msg = fmtError(e.toString())
            error.push(msg.msg)
            return [msg];
          }
        }
      }
    });
    return {
      history: history,
      paste: function(text) {
        Bacon.sequentially(200, roy.splitRoy(text)).filter(nonEmpty).onValue(function(line) {
          var typer = consoleElement.find(".jquery-console-typer")
          console.log("line:" + line + ".")
          typer.trigger("paste").val(line).focus()
          var e = jQuery.Event("keydown");
          e.which = 13;
          e.keyCode = 13;
          setTimeout(function() {
            typer.trigger(e);
          }, 100)
        })
      },
      error: error.toProperty(),
      print: function(line) {
        sendToConsole(line) 
      },
      skipHistory: function() {
        skipHistory = true
      }
    }
  }

  return {
    init: function(element, roy) { return init(element, roy) },
  }
})
