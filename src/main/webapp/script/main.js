"use strict";
require.config({
  paths: {
    "jquery": "../components/jquery/jquery"
    ,"lodash": "../components/lodash/dist/lodash"
    ,"jquery.cookie": "../components/jquery.cookie/jquery.cookie"
    ,"jquery.leanmodal": "../lib/jquery.leanModal"
    ,"jq-console": "../components/jq-console/jqconsole.min"
    ,"bacon": "../components/bacon/dist/Bacon"
    ,"bacon.model": "../components/bacon.model/dist/bacon.model"
    ,"bacon.jquery": "../components/bacon.jquery/dist/bacon.jquery"
    ,"bacon.validation": "../components/bacon.validation/dist/bacon.validation"
    ,"handlebars": "../components/handlebars/handlebars.amd"
    ,"roy": "../lib/roy"
    ,"text": "../lib/text"
    ,"speak": "../speak.js/speakClient"
  },
  shim: {
    'jq-console': {
      deps: ["jquery"]
    }
    ,'jquery.leanmodal': {
      deps: ["jquery"]
    }
  },
  waitSeconds: 60
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

  var element = $("#turtle-roy")
  var royEnv = RoyEnv()
  var repl = RoyRepl.init(element.find(".console"), royEnv)
  var turtle = Turtle(element.find(".turtlegraphics"), width(), height())
  var editor = Editor(element, royEnv, repl)

  var loaded = TurtleBundle(royEnv, turtle, repl, editor).loaded

  loaded.onValue(function() {
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

    element.removeClass("loading")
    repl.focus()
  })

  $(window).resize(function() {
    turtle.resize(width(), height())
  })
})

function nonEmpty(x) { return x && x.length > 0 }
