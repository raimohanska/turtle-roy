"use strict";
define(["lodash", "tco", "barrier", "piano", "commands", "speak"], function(_, tco, barrier, Piano, Commands) {
  // bundles together the scripts that are pre-loaded to turtleroy repl
  return function turtleBundle(royEnv, turtle, repl, editor) {
    var globals = { repl: repl, turtle: turtle, tco: tco, Barrier: barrier, speak: speak }
    royEnv.setGlobals(Piano())
    royEnv.setGlobals(Commands(editor.code, repl))
    royEnv.setGlobals(globals)
    var all = Bacon.combineAsArray(
      Bacon.fromCallback(royEnv, "evalScript", "script/arrays.roy")
      ,Bacon.fromCallback(royEnv, "evalScript", "script/turtle.roy")
    )
    return { loaded: all.map(true) }
  }
})
