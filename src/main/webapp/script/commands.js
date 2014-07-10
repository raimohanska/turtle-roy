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
          return storage.open(author + "/" + name)
        })
      }),
      save: withoutSave(function(name) {
        return withAuthor(function(author) {
          return storage.save(name, code.get())
        })
      }),
      ls: withoutSave(function() {
        return withAuthor(storage.ls)
      }),
      whoami: withoutSave(function() {
        return withAuthor(_.identity)
      })
    }
    return api
  }
})
