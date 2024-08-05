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
    var canvas = document.querySelector('.visualizer');
    var context = canvas.getContext("2d");
    var WIDTH;
    var HEIGHT;
    const PAGE1_X = 125;
    const PAGE1_Y = 355;
    const PAGE2_X = 110;
    const PAGE2_Y = 180;
    var xPos = PAGE1_X;
    var yPos = PAGE1_Y;
  
    function visualize() {
      context.lineWidth = 2;
      WIDTH = canvas.width;
      HEIGHT = canvas.height;

       // Thanks to PitchDetect: https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
       var noteStrings = ["C 1", "C# 1", "D 1", "D# 1", "E 1", "F 1", "F# 1", "G 1", "G# 1", "A 1", "A# 1", "B 1", "C 2", "C# 2", "D 2", "D# 2", "E 2", "F 2", "F# 2", "G 2", "G# 2", "A 2", "A# 2", "B 2", "C 3", "C# 3", "D 3", "D# 3", "E 3", "F 3", "F# 3", "G 3", "G# 3", "A 3", "A# 3", "B 3", "C 4", "C# 4", "D 4", "D# 4", "E 4", "F 4", "F# 4", "G 4", "G# 4", "A 4", "A# 4", "B 4"];
       var yOffset = 0
       const offset = 2
       var noteMap = new Map([
         ["C 1", -offset*29],
         ["C# 1", -offset*28],
         ["D 1", -offset*27],
         ["D# 1", -offset*26],
         ["E 1", -offset*25],
         ["F 1", -offset*24],
         ["F# 1", -offset*23],
         ["G 1", -offset*21],
         ["G# 1", -offset*20],
         ["A 1", -offset*19],
         ["A# 1", -offset*18],
         ["B 1", -offset*17],
         ["C 2", -offset*15],
         ["C# 2", -offset*14],
         ["D 2", -offset*13],
         ["D# 2", -offset*12],
         ["E 2", -offset*11],
         ["F 2", -offset*9],
         ["F# 2", -offset*8],
         ["G 2", -offset*7],
         ["G# 2", -offset*6],
         ["A 2", -offset*5],
         ["A# 2", -offset*4],
         ["B 2", -offset*3],
         ["C 3", 0],
         ["C# 3", offset*2],
         ["D 3", offset*3],
         ["D# 3", offset*4],
         ["E 3", offset*5],
         ["F 3", offset*7],
         ["F# 3", offset*8],
         ["G 3", offset*9],
         ["G# 3", offset*10],
         ["A 3", offset*11],
         ["A# 3", offset*12],
         ["B 3", offset*13],
         ["C 4", offset*15],
         ["C# 4", offset*16],
         ["D 4", offset*17],
         ["D# 4", offset*18],
         ["E 4", offset*19],
         ["F 4", offset*21],
         ["F# 4", offset*22],
         ["G 4", offset*23],
         ["G# 4", offset*24],
         ["A 4", offset*25],
         ["A# 4", offset*26],
         ["B 4", offset*27],
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
            return;
          } else {
            note = document.getElementById('note').innerText
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
          valueToDisplay = noteStrings[noteFromPitch(autoCorrelateValue) % 48];
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
  