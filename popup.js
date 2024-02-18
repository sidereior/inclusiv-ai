// popup.js
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
const recordButton = document.getElementById('recordButton');
const micIcon = recordButton.querySelector('.mic-icon');
const micShadow = recordButton.querySelector('.mic-shadow');
const audioElement = document.getElementById('audio');

recordButton.addEventListener('click', () => {
  if (!isRecording) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioElement.src = audioUrl;
          audioElement.play();
          micIcon.src = 'images/mic-23.png'; // Change back to mic icon
          recordButton.classList.add('no-animation');
          recordButton.classList.remove('recording'); // Stop the animation
          micShadow.style.display = 'none'; // Hide the shadow
          isRecording = false;
        };

        mediaRecorder.start();
        micIcon.src = 'images/stop-button.png'; // Change to stop icon
        recordButton.classList.remove('no-animation');
        recordButton.classList.add('recording'); // Start the animation
        micShadow.style.display = 'block'; // Show the shadow

        isRecording = true;
      })
      .catch(error => {
        console.error('Error accessing the microphone:', error);
      });
  } else {
    // Stop the recording
    mediaRecorder.stop();
  }
});
