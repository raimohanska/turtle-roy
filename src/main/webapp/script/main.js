function nonEmpty(x) { return x.length > 0 }

$(function() {
  var royEnv = RoyEnv()
  repl = royRepl.init($(".console"), royEnv)
  turtle = Turtle($("#turtlegraphics"), 900, 300)
  turtle.spin(360, 10)
  var editor = Editor(royEnv, repl)
  Cookbook(editor, repl)
  var storage = Storage()
  Sharing(editor.code, storage)

  storage.openResult.onValue(function(turtle) {
    editor.reset()
    repl.paste(turtle.content.code)
    document.title = turtle.content.description + " -" + document.title
  })
  var turtleId = document.location.search.split("=")[1]
  if (turtleId) storage.open(turtleId)

  _.merge(window, Commands(storage, editor.code));
})
