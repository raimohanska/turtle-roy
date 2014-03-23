"use strict";
define(["lodash", "tco", "piano", "commands", "speak"], function(_, tco, Piano, Commands) {
  // bundles together the scripts that are pre-loaded to turtleroy repl
  return function turtleBundle(royEnv, turtle, repl, editor, callback) {
    var piano = Piano()
    var globals = { repl: repl, turtle: turtle, tco: tco }
    _.extend(globals, piano, Commands(editor.code));
    royEnv.setGlobals(globals)
    var all = Bacon.combineAsArray(
      Bacon.fromCallback(royEnv, "evalScript", "arrays.roy")
      ,Bacon.fromCallback(royEnv, "evalScript", "turtle.roy")
    )
    all.onValue(callback)
  }
})
