function Oscillator() {
    var audio_context = new (window.AudioContext || window.webkitAudioContext);
    var oscillator = audio_context.createOscillator();

    function play(freq) {
      oscillator = audio_context.createOscillator();
      oscillator.frequency.value = freq;
      oscillator.connect(audio_context.destination);
      oscillator.noteOn(0);
    }

    function stop() {
      oscillator.noteOff(0);
    }

    return {
      note: function(freq, duration) {
        play(freq)
        setTimeout(stop, duration)
      }
    }
}

function Piano() {
  var freqTable = {
    "c": 261.63,
    "d": 293.66,
    "e": 329.63,
    "f": 349.23,
    "g": 392.00,
    "a": 440.00,
    "b": 493.88
  }
  osc = Oscillator()
  defaultDuration = 500
  piano = {
     play: function(note, duration) {
       if (!duration) duration = defaultDuration
       return function(done) {
         if (note instanceof Array) {
           if (note.length)
             piano.play(note[0])(function() {
               piano.play(note.slice(1))(done)
             })
         } else {
           var freq = freqTable[note]
           if (!freq) freq = note
           osc.note(freq, defaultDuration)
           if (done) {
             setTimeout(done, defaultDuration)
           }
         }
       }
     },
     pause: function(done, duration) {
       if (!duration) duration = defaultDuration
       setTimeout(done, defaultDuration)
     }
   }
   _.extend(piano, freqTable)
   return piano
}

var piano = Piano()
_.extend(window, piano)
