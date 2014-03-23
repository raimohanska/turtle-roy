define([], function() {
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
      var chunkSize = Math.min(queue.length, Math.floor(Math.max(1, queue.length / 100)))
      if (chunkSize > 0) {
        var todo = queue.splice(0, chunkSize)
        for (var i = 0; i < chunkSize; i++) {
          todo[i]()
        }
        if (queue.length > 0) {
          schedule()
        }
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
  return {
    step: stepper,
    do: delayed
  }
})

