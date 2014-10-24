define([], function() {
  return function Sandbox() {
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    var frame = window.frames[window.frames.length-1]

    return {
      eval: function(code) {
        return frame.eval(code)
      },
      setGlobals: function(env) {
        _.forEach(env, function(value, key) { 
          frame[key] = value 
        })
      }
    }
  }
})
