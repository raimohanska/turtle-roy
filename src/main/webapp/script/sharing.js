function Sharing(code) {
  shareButton = $("#share button")
  $("#share label").click(function() {
    $("#share form").slideToggle("fast")
  })
  shareClick = shareButton.asEventStream("click")
  shared = shareClick.map(true).toProperty(false)
  nickname = Bacon.UI.textFieldValue($("#nick"), $.cookie("author"))
  nickname.onValue(function(author) {
    $.cookie("author", author, { expires: 365 })
  })
  description = Bacon.UI.textFieldValue($("#description"))
  shareData = Bacon.combineTemplate({
      author: nickname,
      description: description,
      code: code
    })
  shareResult = shareClick.map(shareData).map(function(data) {
    return {
      url: "/turtle",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(data)
    }
  }).ajax()
  pending = shareResult.pending(shareClick)
  pending.assign($("#share .ajax"), "toggle")
  changedSinceShare = shareClick.pending(code.changes())
  okToShare = nickname.map(nonEmpty)
    .and(description.map(nonEmpty)).and(pending.not())
    .and(changedSinceShare)
  okToShare.not().assign(shareButton, "attr", "disabled")
  shareLink = $("#share a")
  var showLink = shared.and(pending.not()).and(changedSinceShare.not())
  Bacon.UI.toggle(showLink, shareLink)
  Bacon.UI.toggle(showLink.not(), shareButton)
  shareResult.map(".id").onValue(function(id) {
    shareLink.attr("href", relativeUrl(id))
    shareLink.text("share this link!")
    repl.print("Saved! URL=" + absoluteUrl(id))
  })
  var inputs = $("#share input")
  code.changes().onValue(function() { 
    $("#description").val("").trigger("keyup")
  })
  Bacon.UI.enable(showLink.not(), inputs)
  anythingToShare = code.changes().map(true).toProperty(false)
  Bacon.UI.fadeToggle(anythingToShare, $("#share"), "slow")

  function relativeUrl(id) {
      return "/?turtle=" + id
  }

  function absoluteUrl(id) {
      return "http://turtle-roy.herokuapp.com" + relativeUrl(id)
  }
}
