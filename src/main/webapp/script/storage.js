function Storage() {
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
  return {
    author: author,
    saveBus: saveBus,
    saveResult: saveResult,
    savePending: savePending
  }
}
