function Storage() {
  var author = Bacon.Model($.cookie("author"))
  author.onValue(function(author) {
    $.cookie("author", author, { expires: 365 })
  })
  return {
    author: author
  }
}
