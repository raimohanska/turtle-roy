"use strict";
define(["storage"], function (storage) {
  return function Sharing(code, turtle) {
    var shareButton = $("#share button");
    $("#share label").click(function () {
      $("#share form").slideToggle("fast");
    });
    var shareClick = shareButton
      .asEventStream("click")
      .doAction(".preventDefault");
    var shared = storage.saveBus.map(true).toProperty(false);
    var nickname = Bacon.$.textFieldValue($("#nick"));
    nickname.bind(storage.author);

    var description = Bacon.$.textFieldValue($("#description"));
    var shareData = Bacon.combineTemplate({
      author: nickname,
      description: description,
      code: code,
    });
    storage.saveBus.plug(shareClick.map(shareData));
    storage.savePending.assign($("#share .ajax"), "toggle");
    var changedSinceShare = code.changes().awaiting(storage.saveBus);
    var okToShare = nickname
      .map(nonEmpty)
      .and(description.map(nonEmpty))
      .and(storage.savePending.not())
      .and(changedSinceShare);
    okToShare.not().assign(shareButton, "attr", "disabled");
    var shareLink = $("#share a");
    var showLink = shared
      .and(storage.savePending.not())
      .and(changedSinceShare.not());
    showLink.assign(shareLink, "toggle");
    showLink.not().assign(shareButton, "toggle");
    storage.saveResult.map(".id").onValue(function (id) {
      shareLink.attr("href", relativeUrl(id));
      shareLink.text("share this link!");
    });
    var inputs = $("#share input");
    code.changes().map("");
    showLink.assign(inputs, "attr", "disabled");
    var anythingToShare = code.changes().map(true).toProperty(false);
    anythingToShare.onValue(function (val) {
      $("#share")[val ? "fadeIn" : "fadeOut"]("slow");
    });

    function relativeUrl(id) {
      return "/?turtle=" + id;
    }
  };
});
