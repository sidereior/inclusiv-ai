// background.js
let mediaRecorder;
let audioChunks = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "toggle_recording") {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioChunks = [];
            // Do something with the audio blob
          };
          mediaRecorder.start();
          sendResponse({status: "recording_started"});
        })
        .catch(error => {
          console.error('Error accessing the microphone:', error);
          sendResponse({status: "recording_failed", error: error.message});
        });
      return true; // keep the message channel open for async response
    } else if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      sendResponse({status: "recording_stopped"});
    }
  }
});
