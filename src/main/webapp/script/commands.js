define([], function() {
  return function Commands(storage, code) {
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
    function syncAjax(params) {
      var result
      params.async = false
      $.ajax(params).then(function(x) {
        result = x
      })
      return result
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
          var turtles = syncAjax({url: "/turtles/" + author})
          var names = _.sortBy(_.uniq(turtles.map(function(t) { return t.content.description })), _.identity)
          return names
        })
      }),
      whoami: withoutSave(function() {
        return withAuthor(_.identity)
      })
    }
    return api
  }
})
