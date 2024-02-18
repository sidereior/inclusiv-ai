// popup.js
let recordButton = document.getElementById('recordButton');
let mediaRecorder;
let audioChunks = [];

recordButton.addEventListener('click', () => {
  // If the MediaRecorder is inactive, start recording
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          // Play the audio at the end of recording
          // Do something with the audio data, e.g., save it or send to server
        };
        audioChunks = []; // Reset chunks for new recording
        mediaRecorder.start();
        recordButton.textContent = 'Stop Recording'; // Update button text
      })
      .catch(e => {
        console.error('Could not start audio recording:', e);
      });
  } else if (mediaRecorder.state === 'recording') {
    // If the MediaRecorder is recording, stop recording
    mediaRecorder.stop();
    recordButton.textContent = 'Start Recording'; // Update button text
  }
});
