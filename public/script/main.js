"use strict";
require.config({
  paths: {
    "jquery": "../../bower_components/jquery/jquery"
    ,"lodash": "../../bower_components/lodash/dist/lodash"
    ,"jquery.cookie": "../../bower_components/jquery.cookie/jquery.cookie"
    ,"jquery.leanmodal": "../lib/jquery.leanModal"
    ,"jq-console": "../../bower_components/jq-console/jqconsole.min"
    ,"bacon": "../../bower_components/bacon/dist/Bacon"
    ,"bacon.model": "../../bower_components/bacon.model/dist/bacon.model"
    ,"bacon.jquery": "../../bower_components/bacon.jquery/dist/bacon.jquery"
    ,"bacon.validation": "../../bower_components/bacon.validation/dist/bacon.validation"
    ,"handlebars": "../../bower_components/handlebars/handlebars.amd"
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
var turtle
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
  turtle = Turtle(element.find(".turtlegraphics"), width(), height())
  var editor = Editor(element, royEnv, repl)

  var loaded = TurtleBundle(royEnv, turtle, repl, editor).loaded

  loaded.onValue(function() {
    turtle.spin(360, 10)
    Cookbook(editor, repl)
    Sharing(editor.code, turtle)

    storage.openResult.onValue(function(turtle) {
      editor.reset()
      repl.paste(turtle.content.code)
      document.title = turtle.content.description + " -" + document.title
    })
    var queryParams = parseQuery(document.location.search)
    var turtleId = queryParams.turtle
    if (turtleId) {
      showEditor()
      storage.open(turtleId)
    } else if (queryParams.code) {
      showEditor()
      editor.reset()
      repl.paste(queryParams.code)
    }
    element.removeClass("loading")
    takeFocus()

  })
  
  element.find(".turtlegraphics").clickE().onValue(takeFocus)

  function showEditor() {
    element.toggleClass("editor-mode")
    takeFocus()
    editor.refresh()
  }

  element.find(".editor-link").asEventStream("click").onValue(showEditor)

  $(window).resize(function() {
    turtle.resize(width(), height())
  })

  function takeFocus() {
    if (element.find(".editor").is(":visible")) {
      element.find(".editor textarea").focus()
    } else {
      repl.focus()
    }
  }
})

function nonEmpty(x) { return x && x.length > 0 }

function parseQuery(qstr) {
  if (qstr == '') return {}
  var query = {}
  var a = qstr.substr(1).split('&')
  for (var i = 0; i < a.length; i++) {
    var b = a[i].split('=')
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '')
  }
  return query
}
