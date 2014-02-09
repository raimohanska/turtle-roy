;(function() {
  Turtle = function(element, w, h) {
    function xCenter() { return w / 2 }
    function yCenter() { return h / 2 }
    function setSize(width, height) {
      w = width
      h = height
      element.css({position: "relative", width: w, height: h})
      element.find("canvas").attr("width", w).attr("height", h)
    }
    var pendown = true

    var paper = createCanvas(0)
    var turtle = createCanvas(1)
    setSize(w, h)
    var cursor = {} // keys: image, width, height, left, top

    paper.save()
    turtle.save()

    init()

    function init() {
      clearTurtle()
      paper.setTransform(1, 0, 0, 1, 0, 0)
      turtle.setTransform(1, 0, 0, 1, 0, 0)
      paper.clearRect(0, 0, w, h)
      turtle.clearRect(0, 0, w, h)
      paper.translate(xCenter(), yCenter());
      turtle.translate(xCenter(), yCenter());
      $("#turtlegraphics").css("background-color", "white");
      paper.font="20px Courier"
      setColor("black")
      drawTurtle()
    }
    function turtleToHome() {
      clearTurtle()
      paper.setTransform(1, 0, 0, 1, 0, 0)
      turtle.setTransform(1, 0, 0, 1, 0, 0)
      paper.translate(xCenter(), yCenter());
      turtle.translate(xCenter(), yCenter());
      drawTurtle()
    }
    function createCanvas(zIndex) {
      var canvas = $("<canvas></canvas>")
      canvas.css({position: "absolute", left: 0, right: 0})
      canvas.css({"z-index": zIndex})
      element.append(canvas)
      return canvas.get(0).getContext('2d');
    }
    function clearTurtle() {
      if ("image" in cursor) {
        turtle.clearRect(cursor.clearOffset, cursor.clearOffset, cursor.clearSize, cursor.clearSize)
      } else {
        turtle.clearRect(-11, -11, 23, 23)
      }
    }
    function drawTurtle() {
      if ("image" in cursor) {
        turtle.drawImage(cursor.image, cursor.left, cursor.top)
      } else {
        turtle.beginPath();
        turtle.moveTo(0, -10);
        turtle.lineTo(5, 10);
        turtle.lineTo(-5, 10);
        turtle.lineTo(0, -10);
        turtle.stroke();
      }
    }
    function setColor(color) {
      paper.strokeStyle=color
      paper.fillStyle=color
    }

    var api = {
      resize: function(newWidth, newHeight) {
        setSize(newWidth, newHeight)
        init()
      },
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
      setshape: function(name) {
        image = new Image()
        image.onload = function() {
          clearTurtle()
          cursor.image = image
          cursor.height = this.height
          cursor.width = this.width
          cursor.left = -this.width / 2
          cursor.top = -this.height / 2
          cursor.clearSize = Math.sqrt(Math.pow(this.height, 2) + Math.pow(this.width, 2)) + 1
          cursor.clearOffset = -cursor.clearSize / 2
          drawTurtle()
        }
        image.src = "images/" + name + ".png"
      },
      background: function(color) {
        Smoothly.do(function() {
          $("#turtlegraphics").css("background-color", color);
        })()
      },
      color: function(color) {
        Smoothly.do(function() {
          setColor(color)
        })()
      },
      text: function(text) {
        Smoothly.do(function() {
          paper.fillText(text, 0, 0)
        })()
      },
      font: function(font) {
        Smoothly.do(function() {
          paper.font = font
        })()
      },
      clear: Smoothly.do(function() {
        init()
      }),
      home: Smoothly.do(function() {
        turtleToHome()
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
