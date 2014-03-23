require.config({
  paths: {
    "kirouter": "../components/ki-router/dist/ki-router"
    ,"jquery": "../components/jquery/jquery"
    ,"lodash": "../components/lodash/dist/lodash"
    ,"jquery.cookie": "../components/jquery.cookie/jquery.cookie"
    ,"jquery.console": "../components/jquery-console/jquery.console"
    ,"jquery.leanmodal": "../components/jquery-leanmodal/jquery.leanModal"
    ,"bacon": "../components/bacon/dist/Bacon"
    ,"bacon.model": "../components/bacon.model/dist/bacon.model"
    ,"bacon.jquery": "../components/bacon.jquery/dist/bacon.jquery"
    ,"bacon.validation": "../components/bacon.validation/dist/bacon.validation"
    ,"handlebars": "../components/handlebars/handlebars.amd"
    ,"royloader": "../lib/royloader"
    ,"roy": "../lib/roy"
  },
  shim: {
    'royloader': {
      exports: 'royloader'
    }
    ,'jquery.console': {
      deps: ["jquery"]
    }
  }
})
require(["lodash", "jquery", "royenv", "royrepl", "turtle", "editor", "commands", "cookbook", "storage", "sharing", "cheatsheet"], 
    function(_, $, RoyEnv, RoyRepl, Turtle, Editor, Commands, Cookbook, Storage, Sharing) {
  overhead = 300
  if (window.self !== window.top) {
    $("body").addClass("embedded")
    overhead = 200
  }
  var royEnv = RoyEnv()
  function width() { return $("body").width() }
  function height() { 
    return Math.min(width() / 2, $(window).height() - overhead)
  }
  repl = RoyRepl.init($(".console"), royEnv)
  turtle = Turtle($("#turtlegraphics"), width(), height())
  turtle.spin(360, 10)
  var editor = Editor($("body"), royEnv, repl)
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

  $(window).resize(function() {
    turtle.resize(width(), height())
  })
})

function nonEmpty(x) { return x && x.length > 0 }
