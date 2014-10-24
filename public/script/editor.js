define(["bacon.jquery"], function() {
  return function Editor(root, royEnv, repl) {
    var editorElement = root.find(".editor textarea")
    code = Bacon.$.textFieldValue(editorElement)

    repl.history.onValue(function(line) {
      editorElement.val(editorElement.val() ? editorElement.val() + "\n" + line : line)
      editorElement.trigger("paste")
    })

    var ctrlSpace = editorElement.asEventStream("keyup")
      .filter(function(e) { return e.ctrlKey && e.keyCode == 32})
      .doAction(".preventDefault")
    root.find(".run-link").asEventStream("click").merge(ctrlSpace).map(code).onValue(function(program) {
      royEnv.eval(program)
    })

    return {
      code: code,
      reset: function() {
        editorElement.val("")
        editorElement.trigger("paste")
      }
    }
  }
})
