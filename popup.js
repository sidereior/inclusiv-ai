// popup.js

const playAudio = (url) => {
  audioElement.src = url
  audioElement.play()
}


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
          // speechToText(audioBlob);

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
                    authorization: 'Bearer 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'
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
                        const jsonString = `{
  "user_info": {
    "colorblind": "n/a OR red-green OR blue-black",
    "adhd": "true OR false",
    "dyslexia": "true OR false"
  },
  "user_requests": ["explainPage", "magnifyPage", "unMagnifyPage", "etc"]
}`;
                       const promptText = "You are tasked with taking a user's text and determing which json values for each field it should have. Users give you a brief description of themselves and any accessibility needs they may have, and you must determine which json values are most fitting for them. The json should be in the format of: " + jsonString + " . The user's description is: " + response.result + " . Determine the json values for each field and you must use some inference in order to determine some fields as a user may only mention a few acessibility needs (or may mention them in an odd way and you must infer what this means) and this means that the rest of the values would be set to whatever value makes them not take effect.";

                        const options3 = {
                        method: 'POST',
                        headers: {
                          accept: 'application/json',
                          'content-type': 'application/json',
                          authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjE4ZGIzN2I0MmU5ZTU4OTllNzI1OWM4NzZhZWUwZjAzIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6MTk6MjAuMzg3NzExIn0.XMGqFSpcgakTSAD2TSnSdnWdO15jQhMwErctkp8PUTo'
                        },
                        body: JSON.stringify({
                          prompt: promptText, // Your task for Llama
                          beam_size: 1, // Optional: Adjust as needed
                          max_length: 256, // Optional: Adjust as needed
                          repetition_penalty: 1.2, // Optional: Adjust as needed
                          temp: 0.98, // Optional: Adjust as needed
                          top_k: 40, // Optional: Adjust as needed
                          top_p: 0.9 // Optional: Adjust as needed
                        })
                      };

                      fetch('https://api.monsterapi.ai/v1/generate/llama2-7b-chat', options3)
                        .then(response => response.json())
                        .then(response => {
                            console.log("Process ID:", response.process_id);
                    console.log("Status:", response.status);

                    if (response.status === "COMPLETED" || response.status === "FAILED") {
                      clearInterval(statusInterval); // Stop checking
                      if (response.status === "COMPLETED") {
                        // this is the json that monsster api has generated
                        console.log("monster api generated:", response.result);
                        

                      }
                    }

                    else {
                      console.log("Transcription Failed.");
                    }


                        })
                         .catch(error => {
                    console.error('Error during status check:', error);
                    clearInterval(statusInterval); // Stop checking on error
                  });
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

const speechToText = (audioBlob) => {
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
}

const textToSpeech = (text) => {    

  const form = new FormData();
  form.append('prompt', text);
  form.append('sample_rate', '25000');
  form.append('speaker', 'en_speaker_6');
  form.append('text_temp', '0.5');
  form.append('wave_temp', '0.5');


  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjE4ZGIzN2I0MmU5ZTU4OTllNzI1OWM4NzZhZWUwZjAzIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6MTk6MjAuMzg3NzExIn0.XMGqFSpcgakTSAD2TSnSdnWdO15jQhMwErctkp8PUTo'
    },
    body: form,
  }
     
  fetch('https://api.monsterapi.ai/v1/generate/sunoai-bark', options)
    .then(response => response.json())
    .then(data => {
      const processId = data.process_id;
      console.log('Initial request success data:', data);

      //repeatedly check the status of the transcription
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
                const audio_file = response.result.output[0]
                playAudio(audio_file);
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
    })
  }

// explainPage
const explainPageBtn = document.getElementById('explainPage');
const explainPageResuts = document.getElementById('explainPageResults');
explainPageBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'explainPage' }, response => {
    const text = response.text;
    textToSpeech(text);
  });
});