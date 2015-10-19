define(["bacon.jquery"], function() {
  return function Editor(root, royEnv, repl) {
    var editorElement = root.find(".editor textarea")
    var runBus = Bacon.Bus()
    codeMirror = CodeMirror.fromTextArea(editorElement.get(0), {
      lineNumbers: true,
      mode: "haskell",
      theme: "solarized dark",
      extraKeys: {
        "Ctrl-Enter": function() { runBus.push() },
        "Ctrl-Space": function() { runBus.push() }
      }
    })
  
    code = Bacon.fromEvent(codeMirror, "change")
      .map(".getValue")
      .toProperty(codeMirror.getValue())

    repl.history.onValue(function(line) {
      codeMirror.setValue(codeMirror.getValue() ? codeMirror.getValue() + "\n" + line : line)
    })

    root.find(".run-link").asEventStream("click").merge(runBus).map(code).onValue(function(program) {
      royEnv.eval(program)
    })

    return {
      code: code,
      reset: function() {
        editorElement.val("")
        editorElement.trigger("paste")
      },
      refresh: function() {
        codeMirror.refresh()
      }
    }
  }
})
