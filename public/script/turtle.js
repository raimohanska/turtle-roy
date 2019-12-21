"use strict";
define(["smoothly", "recorder"], function(Smoothly, Recorder) {
  var Turtle = function(element, w, h) {
    function xCenter() { return w / 2 }
    function yCenter() { return h / 2 }
    function setSize(width, height) {
      w = width
      h = height
      element.css({position: "relative", width: w, height: h})
      element.find("canvas").attr("width", w).attr("height", h)
    }
    var pendown = true

    var paperCanvas = createCanvas(0)
    var paper = paperCanvas.getContext('2d')

    var turtle = createCanvas(1).getContext('2d')
    setSize(w, h)
    var lineWidth = 1
    var cursor = {} // keys: image, width, height, left, top

    paper.save()
    turtle.save()

    init()

    function fontWithSize(size) {
      return size + "px Courier"
    }

    function init() {
      clearTurtle()
      pendown = true
      delete cursor.image
      paper.setTransform(1, 0, 0, 1, 0, 0)
      turtle.setTransform(1, 0, 0, 1, 0, 0)
      paper.clearRect(0, 0, w, h)
      turtle.clearRect(0, 0, w, h)
      paper.translate(xCenter(), yCenter())
      turtle.translate(xCenter(), yCenter())
      setBackground("white")
      paper.font=fontWithSize(20)
      setColor("black")
      drawTurtle()
    }
    function setBackground(color) {
      element.css("background-color", color);
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
      return canvas.get(0);
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
            paper.moveTo(0, 0 + (lineWidth / 2))
            paper.lineTo(0, -step - (lineWidth / 2))
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
        Smoothly.do(function() {
          if (name == "default") {
            clearTurtle()
            delete cursor.image
            drawTurtle()
          } else {
            var image = new Image()
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
          }
        })()
      },
      background: function(color) {
        Smoothly.do(function() {
          setBackground(color)
        })()
      },
      color: function(color) {
        Smoothly.do(function() {
          setColor(color)
        })()
      },
      width: function(width) {
        Smoothly.do(function() {
          lineWidth = width
          paper.lineWidth = lineWidth
        })()
      },
      text: function(text) {
        Smoothly.do(function() {
          paper.fillText(text, 0, 0)
        })()
      },
      font: function(font) {
        if (typeof font == "number") {
          font = fontWithSize(font)
        }
        Smoothly.do(function() {
          paper.font = font
        })()
      },
      clear: function() {
        recorder._recorder.reset()
        Smoothly.do(function() {
          init()
        })()
      },
      home: Smoothly.do(function() {
        turtleToHome()
      })
    }
    var recorder = Recorder(api)
    recorder.exportImage = function() {
      try {
        return paperCanvas.toDataURL("image/png")
      } catch (e) {
        console.log("Unable to generate preview image", e)
      }
    }
    return recorder
  }

  return Turtle
})
