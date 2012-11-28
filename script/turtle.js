;(function() {
  Turtle = function(element, w, h) {
    var x = w / 2
    var y = h / 2
    var pendown = true

    element.css({position: "relative", width: w, height: h})
    var paper = createCanvas(0)
    var turtle = createCanvas(1)
    turtle.clearRect(0, 0, w, h)

    paper.translate(x, y);
    turtle.translate(x, y);

    drawTurtle()
    function createCanvas(zIndex) {
      var canvas = $("<canvas></canvas>").attr("width", w).attr("height", h)
      canvas.css({position: "absolute", left: 0, right: 0})
      canvas.css({"z-index": zIndex})
      element.append(canvas)
      return canvas.get(0).getContext('2d');
    }
    function clearTurtle() {
      turtle.clearRect(-10, -10, 21, 21)
    }
    function drawTurtle() {
      turtle.beginPath(); 
      turtle.moveTo(0, -10);
      turtle.lineTo(5, 10);
      turtle.lineTo(-5, 10);
      turtle.lineTo(0, -10);
      turtle.stroke();
    }
    var queue = []
    var polling = false
    var delay = 1

    function enqueue(f) {
      queue.push(f)
      schedule()
    }

    function schedule() {
      if (!polling) {
        polling = true
        setTimeout(checkQueue, delay)
      }
    }

    function checkQueue() {
      polling = false
      var chunk = Math.max(1, queue.length / 100)
      var left = chunk
      while (left > 0 && queue.length > 0) {
        var first = queue.splice(0,1)[0]
        first()
        left--
      }
      if (queue.length > 0) {
        schedule()
      }
    }

    function repeat(times, f) {
      if (times > 0) {
        f()
        repeat(times - 1, f)
      }
    }
    function delayed(f) {
      return function() {
        enqueue(f)
      }
    }
    function stepper(total, step, f) {
      if (total < 0) step = -step
      function delayedStep(s) {
        return delayed(function() {
            f(s)
        })
      }
      repeat(Math.floor(Math.abs(total / step)), delayedStep(step))
      var remainder = total % step
      if (remainder) {
        delayedStep(remainder)()
      }
    }

    var api = {
      fd: function(dist) {
        stepper(dist, 5, function(step) {
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
        stepper(angle, 10, function(a) {
          clearTurtle()
          paper.rotate(a * Math.PI / 180)
          turtle.rotate(a * Math.PI / 180)
          drawTurtle()
        })
      },
      pendown: delayed(function() {
        pendown = true
      }),
      penup: delayed(function() {
        pendown = false
      }),
      spin: function(degrees, delay) {
        this.lt(360)
      }
    }
    return api
  }
})()
