function Sharing(code, storage) {
  var shareButton = $("#share button")
  $("#share label").click(function() {
    $("#share form").slideToggle("fast")
  })
  var shareClick = shareButton.asEventStream("click")
  var shared = shareClick.map(true).toProperty(false)
  var nickname = Bacon.$.textFieldValue($("#nick"))
  nickname.bind(storage.author)
  var description = Bacon.$.textFieldValue($("#description"))
  var shareData = Bacon.combineTemplate({
      author: nickname,
      description: description,
      code: code
    })
  var shareResult = shareClick.map(shareData).map(function(data) {
    return {
      url: "/turtle",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(data)
    }
  }).ajax()
  var pending = shareClick.awaiting(shareResult)
  pending.assign($("#share .ajax"), "toggle")
  var changedSinceShare = code.changes().awaiting(shareClick)
  var okToShare = nickname.map(nonEmpty)
    .and(description.map(nonEmpty))
    .and(pending.not())
    .and(changedSinceShare)
  okToShare.not().assign(shareButton, "attr", "disabled")
  var shareLink = $("#share a")
  var showLink = shared.and(pending.not()).and(changedSinceShare.not())
  showLink.assign(shareLink, "toggle")
  showLink.not().assign(shareButton, "toggle")
  shareResult.map(".id").onValue(function(id) {
    shareLink.attr("href", relativeUrl(id))
    shareLink.text("share this link!")
    repl.print("Saved! URL=" + absoluteUrl(id))
  })
  var inputs = $("#share input")
  code.changes().onValue(function() { 
    $("#description").val("").trigger("keyup")
  })
  showLink.assign(inputs, "attr", "disabled")
  var anythingToShare = code.changes().map(true).toProperty(false)
  anythingToShare.onValue(function(val) {
    $("#share")[val?"fadeIn":"fadeOut"]("slow")
  })

  function relativeUrl(id) {
      return "/?turtle=" + id
  }

  function absoluteUrl(id) {
      return "http://turtle-roy.herokuapp.com" + relativeUrl(id)
  }
}
