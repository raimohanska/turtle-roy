"use strict";
define(["lodash", "tco", "royenv", "piano", "commands", "speak"], function(_, tco, RoyEnv, Piano, Commands) {
  // bundles together the scripts that are pre-loaded to turtleroy repl
  return function turtleBundle(turtle, repl, editor, callback) {
    var piano = Piano()
    var globals = { repl: repl, turtle: turtle, tco: tco }
    _.extend(globals, piano, Commands(editor.code));
    var all = Bacon.combineAsArray(
      Bacon.fromCallback(RoyEnv, "evalScript", "arrays.roy", globals)
      ,Bacon.fromCallback(RoyEnv, "evalScript", "turtle.roy", globals)
    )
    all.onValue(callback)
  }
})
