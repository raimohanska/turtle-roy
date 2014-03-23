define([], function() {
  return function Cookbook(editor, repl) {
    var square = "let square = repeat 4 (sequence[fd 50, lt 90])"
    addExample("Turtle moves", "fd 50\nlt 45\nfd 50\nrt 45\nfd 50")
    addExample("Square", square + "\nsquare")
    addExample("Circle", "let circle = repeat 360 (sequence [fd 1, rt 1])\ncircle")
    addExample("Flower", "let circle d = repeat 180(sequence[fd d, lt 2])\nlet flower = repeat 12(sequence[circle 1, rt 30, fd 40])\nflower")
    addExample("Speaking Turtle", 'sequence [say "Hello", wait 3, say "I am turtle roy", wait 3, say "Nice to meet you"]')
    addExample("Clear", "clear")
    addExample("Factorial", "let factorial n = if n==1 then 1 else n * (factorial n - 1)\nfactorial 5")
    addExample("Strings", '"Apple" ++ "sauce"')
    addExample("Lists - range", "range 1 10")
    addExample("Lists - head", "head [1,2,3]")
    addExample("Lists - tail", "tail [1,2,3]")
    addExample("Lists - concat", "concat [1,2,3] [4,5,6]")
    addExample("Lists - reverse", "let reverse xs = if (empty xs) then [] else concat (reverse (tail xs)) [head xs]\nreverse [1,2,3]")

    $("#cookbook label").click(function() {
      $("#cookbook ul").slideToggle("fast")
    })
    function addExample(name, code) {
      var element = $("<li>").attr("data-code", code).text(name)
      $("#cookbook ul").append(element)
    }
    $("#cookbook li").click(function() {
      var text = $(this).attr("data-code")
      editor.reset()
      repl.paste(text)
      setTimeout(function() {
        $("#cookbook ul").slideUp("fast")
      }, 100)
    })
  }
});
