function fmt(value, className) {
  return {msg: value, className: "jquery-console-message-" + className};
}

function fmtValue(value) { return fmt(value, "value"); }
function fmtType(value) { return fmt(value, "type"); }
function fmtError(value) { return fmt(value, "error"); }

$(function() {
  var console = $('.console');
  setTimeout(function() {
    setInterval(function() {$(".jquery-console-cursor").toggle()}, 500)
  }, 2500)
  var controller = console.console({
    promptLabel: 'λ> ',
    autofocus: true,
    animateScroll: true,
    promptHistory: true,
    welcomeMessage: "Welcome to Turtle Roy.\nTry this: repeat 360 (sequence[fd 1, lt 1])\nOr try one of the examples below.",

    commandValidate: function(line) {
      return line != "";
    },

    commandHandle: function (line, report) {
      var parts = line.split(" ");

      switch (parts[0]) {
      case ":t":
        var term = parts[1]
        var env = royloader.royEnv(term)
        if (env) {
          return [fmtType(env)];
        } else {
          return [fmtError(term + " is not defined.")];
        }

      case ":c":
        try {
          var code = parts.slice(1).join(" ");
          var compiled = royloader.compileRoy(code)
          return [fmt(compiled.output, "code")];
        } catch(e) {
          return [fmtError(e.toString())];
        }

      default:
        try {
          var evaled = royloader.evalRoy(line);

          if (evaled != undefined) {
            // TODO: hack
            if (typeof evaled.result == "function") {
              evaled.result = evaled.result()
              return ""
            }
            return [fmtValue(JSON.stringify(evaled.result))];
          } else {
            return true;
          }
        } catch(e) {
          return [fmtError(e.toString())];
        }
      }
    }
  });
});
