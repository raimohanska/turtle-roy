define(["lodash", "tco", "royenv", "piano", "speak"], function(_, tco, RoyEnv, Piano) {
  // bundles together the scripts that are pre-loaded to turtleroy repl
  return function turtleBundle(turtle, repl) {
    var piano = Piano()
    var globals = { repl: repl, turtle: turtle, tco: tco }
    _.extend(globals, piano)
    var all = Bacon.combineAsArray(
      Bacon.fromCallback(RoyEnv, "evalScript", "arrays.roy", globals)
      ,Bacon.fromCallback(RoyEnv, "evalScript", "turtle.roy", globals)
    )
    all.onValue()
    return all
  }
})
