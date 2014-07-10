"use strict";
define(["storage"], function(storage) {
  return function Commands(code, repl) {
    function withoutSave(f) {
      return function() {
        var result = f.apply(this, arguments)
        repl.skipHistory()
        return result
      }
    }
    function withAuthor(f) {
      var author = storage.author.get()
      if (!author) {
        return "Who are you? Type login <yourname>"
      } else {
        return f(author)
      }
    }
    var api = {
      login: withoutSave(function(author) {
        storage.author.set(author)
      }),
      logout: withoutSave(function() {
        storage.author.set("")
      }),
      open: withoutSave(function(name) {
        return withAuthor(function(author) {
          storage.open(author + "/" + name)
        })
      }),
      save: withoutSave(function(name) {
        return withAuthor(function(author) {
          storage.saveBus.push({
            author: storage.author.get(),
            description: name,
            code: code.get()
          })
        })
      }),
      ls: withoutSave(function() {
        return withAuthor(function(author) {
          return Bacon.fromPromise($.ajax({url: "/turtles/" + author}))
            .map(function(turtles) {
              var names = _.sortBy(_.uniq(turtles.map(function(t) { return t.content.description })), _.identity)
              return names
            })
        })
      }),
      whoami: withoutSave(function() {
        return withAuthor(_.identity)
      })
    }
    return api
  }
})
