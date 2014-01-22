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
  var turtleLoader = TurtleLoader(repl, editor);
  _.merge(window, Commands(turtleLoader, storage, editor.code));
})
