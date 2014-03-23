"use strict";
define([], function() {
  var audio_context = new (window.AudioContext || window.webkitAudioContext || DummyAudioContext);

  function DummyAudioContext() {
    this.createOscillator = function() {
      throw "No WebAudio support"
    }
  }

  function Oscillator() {
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
        note: function(freq, duration, done) {
          play(freq)
          setTimeout(function(){
            stop()
            done()
          }, duration)
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
      "b": 493.88,
      "h": 493.88
    }
    var defaultDuration = 500
    var oscillators = []

    function getOscillator() {
      var osc = oscillators.splice(oscillators.length - 1)[0]
      if (!osc) 
        osc = Oscillator()
      return osc
    }
    function releaseOscillator(osc) {
      oscillators.push(osc)
    }
    var piano = {
       play: function(note, duration) {
         if (!duration) duration = defaultDuration
         return function(done) {
           if (note instanceof Array) {
             if (note.length)
               piano.play(note[0], duration)(function() {
                 piano.play(note.slice(1), duration)(done)
               })
           } else {
             var osc = getOscillator()
             if (note != " ") {
               var freq = freqTable[note]
               if (!freq) freq = note
               osc.note(freq, duration, function() {
                 releaseOscillator(osc)
                 if (done) done()
               })
             } else if (done) {
               setTimeout(done, duration)
             }
           }
         }
       },
       pause: function(done, duration) {
         if (!duration) duration = defaultDuration
         setTimeout(done, defaultDuration)
       },
       tempo: function(tempo) {
         defaultDuration = tempo
       }
     }
     _.extend(piano, freqTable)
     return piano
  }
  return Piano
})
