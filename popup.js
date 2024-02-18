// popup.js
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
const recordButton = document.getElementById('recordButton');
const micIcon = recordButton.querySelector('.mic-icon'); // Make sure your microphone image has class="mic-icon"
const audioElement = document.getElementById('audio');

recordButton.addEventListener('click', () => {
  if (!isRecording) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new Media Recorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioElement.src = audioUrl;
          audioElement.play();
        };

        mediaRecorder.start();
        micIcon.src = 'images/stop-button.png'; // Path to your stop icon
        recordButton.classList.add('recording'); // Add 'recording' class to the button

        isRecording = true;
      })
      .catch(error => {
        console.error('Error accessing the microphone:', error);
      });
  } else {
    mediaRecorder.stop();
    isRecording = false;
  }
});

// This will listen for the 'stop' event of the mediaRecorder
mediaRecorder.addEventListener('stop', () => {
  micIcon.src = 'images/mic-23.png'; // Path to your microphone icon
  recordButton.classList.remove('recording'); // Remove 'recording' class from the button
});
