function Editor(royEnv, repl) {
  var editorElement = $(".editor textarea")
  code = Bacon.$.textFieldValue(editorElement)
  $(".editor").hide()
  $(".editor-link").asEventStream("click").onValue(function() {
    $(".editor").toggle()
    $(".console").toggle()
  })

  repl.history.onValue(function(line) {
    editorElement.val(editorElement.val() ? editorElement.val() + "\n" + line : line)
    editorElement.trigger("paste")
  })

  var ctrlSpace = editorElement.asEventStream("keyup")
    .filter(function(e) { return e.ctrlKey && e.keyCode == 32})
    .doAction(".preventDefault")
  $(".run-link").asEventStream("click").merge(ctrlSpace).map(code).onValue(function(program) {
    royEnv.evalRoy(program)
  })

  return {
    code: code,
    reset: function() {
      editorElement.val("")
      editorElement.trigger("paste")
    }
  }
}

