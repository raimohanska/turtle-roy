;(function() {
  Turtle = function(element, w, h) {
    var x = w / 2
    var y = h / 2
    var pendown = true

    element.css({position: "relative", width: w, height: h})
    var paper = createCanvas(0)
    var turtle = createCanvas(1)
    paper.save()
    turtle.save()

    init()

    function init() {
      clearTurtle()
      paper.setTransform(1, 0, 0, 1, 0, 0)
      turtle.setTransform(1, 0, 0, 1, 0, 0)
      paper.clearRect(0, 0, w, h)
      paper.clearRect(0, 0, w, h)
      paper.translate(x, y);
      turtle.translate(x, y);
      drawTurtle()
    }
    function createCanvas(zIndex) {
      var canvas = $("<canvas></canvas>").attr("width", w).attr("height", h)
      canvas.css({position: "absolute", left: 0, right: 0})
      canvas.css({"z-index": zIndex})
      element.append(canvas)
      return canvas.get(0).getContext('2d');
    }
    function clearTurtle() {
      turtle.clearRect(-11, -11, 23, 23)
    }
    function drawTurtle() {
      turtle.beginPath(); 
      turtle.moveTo(0, -10);
      turtle.lineTo(5, 10);
      turtle.lineTo(-5, 10);
      turtle.lineTo(0, -10);
      turtle.stroke();
    }

    var api = {
      fd: function(dist) {
        Smoothly.step(dist, 5, function(step) {
          if (pendown) {
            paper.beginPath()
            paper.moveTo(0, 0)
            paper.lineTo(0, -step)
            paper.stroke()
          }
          clearTurtle()
          paper.translate(0, -step)
          turtle.translate(0, -step)
          drawTurtle()
        })
      },
      lt: function(angle) {
        this.rt(-angle)
      },
      rt: function(angle) {
        Smoothly.step(angle, 10, function(a) {
          clearTurtle()
          paper.rotate(a * Math.PI / 180)
          turtle.rotate(a * Math.PI / 180)
          drawTurtle()
        })
      },
      pendown: Smoothly.do(function() {
        pendown = true
      }),
      penup: Smoothly.do(function() {
        pendown = false
      }),
      spin: function(degrees, delay) {
        this.lt(360)
      },
      clear: Smoothly.do(function() {
        init()
      })
    }
    return api
  }

  window.Barrier = function(callback, things) {
    var count = things.length
    return {
      countDown: function(x) {
        count--
        if (count == 0 && callback) callback()
      }
    }
  }
})()
