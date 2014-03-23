"use strict";
require.config({
  paths: {
    "kirouter": "../components/ki-router/dist/ki-router"
    ,"jquery": "../components/jquery/jquery"
    ,"lodash": "../components/lodash/dist/lodash"
    ,"jquery.cookie": "../components/jquery.cookie/jquery.cookie"
    ,"jquery.console": "../lib/jquery.console"
    ,"jquery.leanmodal": "../lib/jquery.leanModal"
    ,"bacon": "../components/bacon/dist/Bacon"
    ,"bacon.model": "../components/bacon.model/dist/bacon.model"
    ,"bacon.jquery": "../components/bacon.jquery/dist/bacon.jquery"
    ,"bacon.validation": "../components/bacon.validation/dist/bacon.validation"
    ,"handlebars": "../components/handlebars/handlebars.amd"
    ,"royloader": "../lib/royloader"
    ,"roy": "../lib/roy"
    ,"text": "../lib/text"
    ,"speak": "../speak.js/speakClient"
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
require(["lodash", "jquery", "royenv", "royrepl", "turtle", "turtlebundle", "editor", "commands", "cookbook", "storage", "sharing", "cheatsheet", "help"], 
    function(_, $, RoyEnv, RoyRepl, Turtle, TurtleBundle, Editor, Commands, Cookbook, storage, Sharing) {
  var overhead = 300
  if (window.self !== window.top) {
    $("body").addClass("embedded")
    overhead = 200
  }
  function width() { return $("body").width() }
  function height() { 
    return Math.min(width() / 2, $(window).height() - overhead)
  }
  var repl = RoyRepl.init($(".console"), RoyEnv)
  var turtle = Turtle($("#turtlegraphics"), width(), height())
  var editor = Editor($("body"), RoyEnv, repl)

  TurtleBundle(turtle, repl, editor, function() {
    turtle.spin(360, 10)
    Cookbook(editor, repl)
    Sharing(editor.code)

    storage.openResult.onValue(function(turtle) {
      editor.reset()
      repl.paste(turtle.content.code)
      document.title = turtle.content.description + " -" + document.title
    })
    var turtleId = document.location.search.split("=")[1]
    if (turtleId) storage.open(turtleId)


    $(window).resize(function() {
      turtle.resize(width(), height())
    })
  })
})

function nonEmpty(x) { return x && x.length > 0 }
