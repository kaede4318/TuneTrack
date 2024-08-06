/*
The MIT License (MIT)
Copyright (c) 2014 Chris Wilson
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Note: autoCorrelate comes from https://github.com/cwilso/PitchDetect/pull/23
with the above license.

*/

export default function init(bpm, measures) {
    var measures = measures
    var bpm = bpm
    var source;
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioContext.createAnalyser();
    analyser.minDecibels = -100;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    if (!navigator?.mediaDevices?.getUserMedia) {
      // No audio allowed
      alert('Sorry, getUserMedia is required for the app.')
      return;
    } else {
      var constraints = {audio: true};
      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
          // Initialize the SourceNode
          source = audioContext.createMediaStreamSource(stream);
          // Connect the source node to the analyzer
          source.connect(analyser);
          visualize();
        })
        // .catch(function(err) {
        //   alert('Sorry, microphone permissions are required for the app. Feel free to read on without playing :)')
        // });
    }
  
    // Visualizing, copied from voice change o matic
    var pagenav = document.querySelector(".pagenav")
    pagenav.style.display='none';
    var canvas = document.querySelector('.visualizer');
    var context = canvas.getContext("2d");
    var WIDTH;
    var HEIGHT;
    const PAGE1_X = 125;
    const PAGE1_Y = 365;
    const PAGE2_X = 110;
    const PAGE2_Y = 180;
    var xPos = PAGE1_X;
    var yPos = PAGE1_Y;

    function visualize() {
      context.lineWidth = 2;
      WIDTH = canvas.width;
      HEIGHT = canvas.height;

       // Thanks to PitchDetect: https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
       var yOffset = 0
       const offset = 2.5
       var noteMap = new Map([["A0", -(offset*56)], ["A#0", -(offset*55)], ["B0", -(offset*54)],
         ["C1", -(offset*52)], ["C#1", -(offset*51)], ["D1", -(offset*50)], ["D#1", -(offset*49)], ["E1", -(offset*48)], ["F1", -(offset*46)], ["F#1", -(offset*45)], ["G1", -(offset*44)], ["G#1", -(offset*43)], ["A1", -(offset*42)], ["A#1", -(offset*41)], ["B1", -(offset*40)],
         ["C2", -(offset*38)], ["C#2", -(offset*37)], ["D2", -(offset*36)], ["D#2", -(offset*35)], ["E2", -(offset*34)], ["F2", -(offset*32)], ["F#2", -(offset*31)], ["G2", -(offset*30)], ["G#2", -(offset*29)], ["A2", -(offset*28)], ["A#2", -(offset*27)], ["B2", -(offset*26)],
         ["C3", -(offset*24)], ["C#3", -(offset*23)], ["D3", -(offset*22)], ["D#3", -(offset*21)], ["E3", -(offset*20)], ["F3", -(offset*18)], ["F#3", -(offset*17)], ["G3", -(offset*16)], ["G#3", -(offset*15)], ["A3", -(offset*14)], ["A#3", -(offset*13)], ["B3", -(offset*12)],
         ["C4", -(offset*10)], ["C#4", -(offset*9)], ["D4", -(offset*8)], ["D#4", -(offset*7)], ["E4", -(offset*6)], ["F4", -(offset*4)], ["F#4", -(offset*3)], ["G4", -(offset*2)], ["G#4", -offset], ["A4", 0], ["A#4", offset], ["B4", offset*2],
         ["C5", offset*4], ["C#5", offset*5], ["D5", offset*6], ["D#5", offset*7], ["E5", offset*8], ["F5", offset*10], ["F#5", offset*11], ["G5", offset*12], ["G#5", offset*13], ["A5", offset*14], ["A#5", offset*15], ["B5", offset*16],
         ["C6", offset*18], ["C#6", offset*19], ["D6", offset*20], ["D#6", offset*21], ["E6", offset*22], ["F6", offset*23], ["F#6", offset*24], ["G6", offset*26], ["G#6", offset*27], ["A6", offset*28], ["A#6", offset*29], ["B6", offset*30],
         ["C7", offset*32], ["C#7", offset*33], ["D7", offset*34], ["D#7", offset*35], ["E7", offset*36], ["F7", offset*38], ["F#7", offset*39], ["G7", offset*40], ["G#7", offset*41], ["A7", offset*42], ["A#7", offset*43], ["B7", offset*44],
         ["C8", offset*46],
         ["Too quiet...", 0],
       ]);

      var drawNote
      var drawNoteVisual

      var lineSpacing = 108
      const framesPerSecond = 60;
      const secondsPerBeat = 60 / bpm;
      const pixelsPerBeat = WIDTH / (framesPerSecond * secondsPerBeat);

      const framesPerBeat = framesPerSecond * (60 / bpm)
      const framesPerMeasure = framesPerBeat * 3
      const secondsPerMeasure = secondsPerBeat * 3

      var frameCounter = 0
      var measureCounter = 0
      var pixelCounter = 0

      // calculate pixels per second for first measure
      var pixelsPerSecond = measures[0][1] / secondsPerMeasure
      var pixelsPerFrame = measures[0][1] / framesPerMeasure
      var pixelsToMove = 0
      var measurePos = 0

      // var colors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)']
      const pitchColor = 'rgb(255, 89, 89)'
      const inactivePitchColor = 'rgb(255, 120, 120)'
      context.strokeStyle = pitchColor
      const draw = () => {
        const btn = document.getElementById("pitch-feedback-button")
        if (audioContext.state != "closed") {
          if (!btn.classList.contains("enabled")) {
            console.log("stop recording")
            pagenav.style.display='block';
            return;
          } else {
            var note = document.getElementById('note').innerText
          }
        }
        if (pixelsPerFrame) {
          pixelsToMove = pixelsPerFrame
          pixelsToMove = Math.round(pixelsToMove)
        }

        context.beginPath();
        context.moveTo(xPos, yPos - noteMap.get(note) + yOffset);
        context.lineTo(xPos + pixelsToMove,  yPos - noteMap.get(note) + yOffset);
        context.stroke();

        xPos += pixelsToMove;
        measurePos += pixelsToMove

        if (measurePos >= measures[measureCounter][1]) {
          measureCounter += 1
          if (measureCounter >= measures.length) {
            return;
          }
          if (!measures[measureCounter][1]) {
            console.log("newpage")
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            xPos = PAGE2_X;
            yPos = PAGE2_Y;
            yOffset = 0;
            lineSpacing = 160;
            measureCounter += 1
            next = document.getElementById("next-btn")
            console.log(next)
            next.click()
          }  
          pixelsPerFrame = measures[measureCounter][1] / framesPerMeasure
          measurePos = 0
        }
        if (xPos >= (WIDTH - 48)) {
          console.log("if")
          console.log(measureCounter)
          xPos = 110; // Reset position when it goes off-screen
          yOffset += lineSpacing
        }
        console.log("requestframe")
        requestAnimationFrame(draw); // Continue animation
      };
  
      var previousValueToDisplay = 0;
      var smoothingCount = 0;
      var smoothingThreshold = 5;
      var smoothingCountThreshold = 5;
  
      function noteFromPitch( frequency ) {
        var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        return Math.round( noteNum ) + 69;
      }
  
      var drawNote = function() {

        const btn = document.getElementById("pitch-feedback-button")
        if (audioContext.state != "closed") {
          if (!btn.classList.contains("enabled")) {
            console.log("stop recording")
            pagenav.style.display='block';
            audioContext.close();
            return;
          }
        }
        drawNoteVisual = requestAnimationFrame(drawNote);
        var bufferLength = analyser.fftSize;
        var buffer = new Float32Array(bufferLength);
        analyser.getFloatTimeDomainData(buffer);
        var autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate)

        // Handle rounding
        var valueToDisplay = autoCorrelateValue;
        var roundingValue = 'note'
        if (roundingValue == 'none') {
          // Do nothing
        } else if (roundingValue == 'hz') {
          valueToDisplay = Math.round(valueToDisplay);
        } else {
          // Get the closest note
          // Thanks to PitchDetect:
          valueToDisplay = getNoteFromHz(Math.round(valueToDisplay));
        }

       function getNoteFromHz(hz) {
        var noteStrings = ["A0", "A#0", "B0",
          "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", 
          "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", 
          "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", 
          "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
          "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
          "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
          "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
          "C8"];
          const semitone = 1.059
          const A4 = 440
          const A4index = 48
          console.log(noteStrings[A4index])
          console.log(hz)
          var n = 12 * Math.log2(hz/440)
          console.log(n)
          n = Math.round(n)
          console.log(n)
          console.log(noteStrings[A4index + n])
          return noteStrings[A4index + n]
        }
  
        var smoothingValue = 'basic'
  
  
        if (autoCorrelateValue === -1) {
          document.getElementById('note').innerText = 'Too quiet...';
          return;
        }
        if (smoothingValue === 'none') {
          smoothingThreshold = 99999;
          smoothingCountThreshold = 0;
        } else if (smoothingValue === 'basic') {
          smoothingThreshold = 10;
          smoothingCountThreshold = 5;
        } else if (smoothingValue === 'very') {
          smoothingThreshold = 5;
          smoothingCountThreshold = 10;
        }
        function noteIsSimilarEnough() {
          // Check threshold for number, or just difference for notes.
          if (typeof(valueToDisplay) == 'number') {
            return Math.abs(valueToDisplay - previousValueToDisplay) < smoothingThreshold;
          } else {
            return valueToDisplay === previousValueToDisplay;
          }
        }
        // Check if this value has been within the given range for n iterations
        if (noteIsSimilarEnough()) {
          if (smoothingCount < smoothingCountThreshold) {
            smoothingCount++;
            return;
          } else {
            previousValueToDisplay = valueToDisplay;
            smoothingCount = 0;
          }
        } else {
          previousValueToDisplay = valueToDisplay;
          smoothingCount = 0;
          return;
        }
        if (typeof(valueToDisplay) == 'number') {
          valueToDisplay += ' Hz';
        }
        document.getElementById('note').innerText = valueToDisplay;
      }
  
      var drawFrequency = function() {
        var bufferLengthAlt = analyser.frequencyBinCount;
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);
  
        // canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  
        var drawAlt = function() {
          drawVisual = requestAnimationFrame(drawAlt);
  
          analyser.getByteFrequencyData(dataArrayAlt);
  
          // canvasContext.fillStyle = 'rgb(0, 0, 0)';
          // canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
  
          var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
          var barHeight;
          var x = 0;
  
          for(var i = 0; i < bufferLengthAlt; i++) {
            barHeight = dataArrayAlt[i];
  
            // canvasContext.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            // canvasContext.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
  
            x += barWidth + 1;
          }
        };
  
        console.log('wut')
        drawAlt();
      }
      drawNote();
      draw();
    }
  }
  
  
  // Must be called on analyser.getFloatTimeDomainData and audioContext.sampleRate
  // From https://github.com/cwilso/PitchDetect/pull/23
  function autoCorrelate(buffer, sampleRate) {
    // Perform a quick root-mean-square to see if we have enough signal
    var SIZE = buffer.length;
    var sumOfSquares = 0;
    for (var i = 0; i < SIZE; i++) {
      var val = buffer[i];
      sumOfSquares += val * val;
    }
    var rootMeanSquare = Math.sqrt(sumOfSquares / SIZE)
    if (rootMeanSquare < 0.01) {
      return -1;
    }
  
    // Find a range in the buffer where the values are below a given threshold.
    var r1 = 0;
    var r2 = SIZE - 1;
    var threshold = 0.2;
  
    // Walk up for r1
    for (var i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }
  
    // Walk down for r2
    for (var i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
      }
    }
  
    // Trim the buffer to these ranges and update SIZE.
    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length
  
    // Create a new array of the sums of offsets to do the autocorrelation
    var c = new Array(SIZE).fill(0);
    // For each potential offset, calculate the sum of each buffer value times its offset value
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j+i]
      }
    }
  
    // Find the last index where that value is greater than the next one (the dip)
    var d = 0;
    while (c[d] > c[d+1]) {
      d++;
    }
  
    // Iterate from that index through the end and find the maximum sum
    var maxValue = -1;
    var maxIndex = -1;
    for (var i = d; i < SIZE; i++) {
      if (c[i] > maxValue) {
        maxValue = c[i];
        maxIndex = i;
      }
    }
  
    var T0 = maxIndex;
  
    // Not as sure about this part, don't @ me
    // From the original author:
    // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
    // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
    // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
    var x1 = c[T0 - 1];
    var x2 = c[T0];
    var x3 = c[T0 + 1]
  
    var a = (x1 + x3 - 2 * x2) / 2;
    var b = (x3 - x1) / 2
    if (a) {
      T0 = T0 - b / (2 * a);
    }
  
    return sampleRate/T0;
  }
  