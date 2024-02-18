// popup.js
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
const recordButton = document.getElementById('recordButton');
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

          const form = new FormData();
          form.append('file', audioBlob, 'audio.wav');
          form.append('do_sample', 'true');
          form.append('repetition_penalty', '0.9');
          form.append('temperature', '0.9');
          form.append('top_k', '50');
          form.append('top_p', '0.9');

          const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjE4ZGIzN2I0MmU5ZTU4OTllNzI1OWM4NzZhZWUwZjAzIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6MTk6MjAuMzg3NzExIn0.XMGqFSpcgakTSAD2TSnSdnWdO15jQhMwErctkp8PUTo'
            },
            body: form
          };

          // First request to MonsterAPI for speech to text conversion
          fetch('https://api.monsterapi.ai/v1/generate/speech2text-v2', options)
            .then(response => response.json())
            .then(data => {
              const processId = data.process_id;
              console.log('Initial request success data:', data);

              // Function to repeatedly check the status of the transcription
              const checkStatus = () => {
                const options2 = {
                  method: 'GET',
                  headers: {
                    accept: 'application/json',
                    authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjE4ZGIzN2I0MmU5ZTU4OTllNzI1OWM4NzZhZWUwZjAzIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6MTk6MjAuMzg3NzExIn0.XMGqFSpcgakTSAD2TSnSdnWdO15jQhMwErctkp8PUTo'
                  }
                };

                fetch(`https://api.monsterapi.ai/v1/status/${processId}`, options2)
                  .then(response => response.json())
                  .then(response => {
                    console.log("Process ID:", response.process_id);
                    console.log("Status:", response.status);

                    if (response.status === "COMPLETED" || response.status === "FAILED") {
                      clearInterval(statusInterval); // Stop checking
                      if (response.status === "COMPLETED") {
                        console.log("Transcription Completed:", response.result);
                        // Future logic goes here
                      } else {
                        console.log("Transcription Failed.");
                      }
                    }
                  })
                  .catch(error => {
                    console.error('Error during status check:', error);
                    clearInterval(statusInterval); // Stop checking on error
                  });
              };

              // Start checking the status every 0.5 seconds
              const statusInterval = setInterval(checkStatus, 500);
            })
            .catch(error => {
              console.error('Error during initial transcription request:', error);
            });

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
