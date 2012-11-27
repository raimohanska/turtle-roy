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
    return {
      fd: function(dist) {
        if (pendown) {
          paper.beginPath()
          paper.moveTo(0, 0)
          paper.lineTo(0, -dist)
          paper.stroke()
        }
        clearTurtle()
        paper.translate(0, -dist)
        turtle.translate(0, -dist)
        drawTurtle()
      },
      lt: function(angle) {
        this.rt(-angle)
      },
      rt: function(angle) {
        clearTurtle()
        paper.rotate(angle * Math.PI / 180)
        turtle.rotate(angle * Math.PI / 180)
        drawTurtle()
      },
      pendown: function() {
        pendown = true
      },
      penup: function() {
        pendown = false
      }
    }
  }
})()
