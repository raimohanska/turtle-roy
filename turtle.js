;(function() {
  Turtle = function(context, x, y) {
    var pendown = true
    context.translate(x, y);
    drawTurtle()
    function drawTurtle() {
      context.save();
      context.beginPath(); 
      context.moveTo(0, -10);
      context.lineTo(5, 10);
      context.lineTo(-5, 10);
      context.lineTo(0, -10);
      context.stroke();
    }
    return {
      fd: function(dist) {
        if (pendown) {
          context.beginPath()
          context.moveTo(0, 0)
          context.lineTo(0, -dist)
          context.stroke()
        }
        context.translate(0, -dist)
        drawTurtle()
      },
      lt: function(angle) {
        this.rt(-angle)
      },
      rt: function(angle) {
        context.rotate(angle * Math.PI / 180)
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
