define(["jquery", "jquery.cookie"], function($) {
  return function Storage() {
    var author = Bacon.Model($.cookie("author"))
    author.onValue(function(author) {
      $.cookie("author", author, { expires: 365 })
    })
    var saveBus = new Bacon.Bus()
    var saveResult = saveBus.map(function(data) {
      return {
        url: "/turtle",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(data)
      }
    }).ajax()
    var savePending = saveBus.awaiting(saveResult)

    var openBus = new Bacon.Bus()
    var openResult = openBus.ajax()

    return {
      author: author,
      saveBus: saveBus,
      saveResult: saveResult,
      savePending: savePending,
      open: function(name) { openBus.push("/turtle/" + name) },
      openResult: openResult
    }
  }
})
