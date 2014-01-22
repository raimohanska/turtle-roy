function TurtleLoader(repl, editor) {
  var turtleId = document.location.search.split("=")[1]
  function loadTurtle(url) {
    $.ajax(url).done(function(turtle) {
      editor.reset()
      repl.paste(turtle.content.code)
      document.title = turtle.content.description + " -" + document.title
    })
  }
  if (turtleId) loadTurtle("/turtle/" + turtleId)
  return {
    load: loadTurtle
  }
}

