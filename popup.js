// popup.js
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
const recordButton = document.getElementById('recordButton');
const audioElement = document.getElementById('audio'); // Assuming you have an <audio> element in your popup.html

recordButton.addEventListener('click', () => {
  if (!isRecording) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = []; // Reset the chunks array for new recording
        
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioElement.src = audioUrl; // Set the source of the audio element to the blob URL
        };

        mediaRecorder.start();
        recordButton.textContent = 'Stop Recording';
        isRecording = true;
      })
      .catch(error => {
        console.error('Error accessing the microphone:', error);
      });
  } else {
    // When the user clicks to stop recording
    mediaRecorder.stop();
    recordButton.textContent = 'Start Recording';
    isRecording = false;
  }
});
