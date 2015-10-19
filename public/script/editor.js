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
      clearError()
      try {
        royEnv.eval(program)
      } catch (e) {
        showError(e)
      }
    })
    
    code.changes().onValue(clearError)

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

    var errorLine = undefined

    function clearError() {
      showErrorText("")
      if (errorLine !== undefined) { 
        codeMirror.removeLineClass(errorLine, 'gutter', 'line-error')
        errorLine = undefined
      }
    }

    function showError(error) {
      if (error.lineNumber > codeMirror.lineCount()) {
        error.lineNumber = undefined
      }
      if (error.lineNumber) {
        errorLine = error.lineNumber - 1
        codeMirror.addLineClass(errorLine, 'gutter', 'line-error');
        showErrorText("Error on line " + error.lineNumber + ": " + error.message)
      } else {
        showErrorText("Error: " + error.message)
      }
    }
    
    function showErrorText(text) {
      editorElement.parent().find(".error").text(text)
    }
  }
})
