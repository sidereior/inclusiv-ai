


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
                        // Assuming this part is inside the `if (response.status === "COMPLETED")` block of the transcription check

const jsonString = `
"changes_description": "A greeting and brief description of the changes made to the page to make it more accessible to the user.", 
"user_data": {
  "user_info": {
    "colorblind": "n/a OR red-green OR blue-black",
    "adhd": "true OR false",
    "dyslexia": "true OR false"
  },
  "user_requests": ["explainPage", "magnifyPage", "unMagnifyPage", "etc"]
}`;
const promptText = `You are tasked with taking a user's text and determining which json values for each field it should have. Users give you a brief description of themselves and any accessibility needs they may have, and you must determine which json values are most fitting for them and give a short 1-2 sentence description of which tools you're enabling and greeting the user. The json should be in the format of: ${jsonString} . The user's description is: ${response.result} . Determine the json values for each field and you must use some inference in order to determine some fields as a user may only mention a few accessibility needs (or may mention them in an odd way and you must infer what this means) and this means that the rest of the values would be set to whatever value makes them not take effect. Additionaly be sure to make the brief sentence greeting the user and explaining what you're enabling for them.`;

const options3 = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjE4ZGIzN2I0MmU5ZTU4OTllNzI1OWM4NzZhZWUwZjAzIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6MTk6MjAuMzg3NzExIn0.XMGqFSpcgakTSAD2TSnSdnWdO15jQhMwErctkp8PUTo'

    
  },
  body: JSON.stringify({
    prompt: promptText,
    beam_size: 1,
    max_length: 256,
    repetition_penalty: 1.2,
    temp: 0.98,
    top_k: 40,
    top_p: 0.9
  })
};

fetch('https://api.monsterapi.ai/v1/generate/llama2-7b-chat', options3)
  .then(response => response.json())
  .then(data => {
    const processId = data.process_id;
    console.log('Request submitted, process ID:', processId);

    // Function to repeatedly check the status of the processing
    const checkProcessStatus = () => {
      const statusOptions = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjE4ZGIzN2I0MmU5ZTU4OTllNzI1OWM4NzZhZWUwZjAzIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6MTk6MjAuMzg3NzExIn0.XMGqFSpcgakTSAD2TSnSdnWdO15jQhMwErctkp8PUTo'
        }
      };

      fetch(`https://api.monsterapi.ai/v1/status/${processId}`, statusOptions)
        .then(response => response.json())
        .then(statusResponse => {
          console.log("Process ID:", processId);
          console.log("Status:", statusResponse.status);

          if (statusResponse.status === "COMPLETED" || statusResponse.status === "FAILED") {
            clearInterval(processStatusInterval); // Stop checking
            if (statusResponse.status === "COMPLETED") {
              console.log("Processing Completed:", statusResponse.result);


              

              // Here, handle the result of the processing
            } else {
              console.log("Processing Failed.");
            }
          }
        })
        .catch(error => {
          console.error('Error during process status check:', error);
          clearInterval(processStatusInterval); // Stop checking on error
        });
    };

    // Start checking the status every 500 milliseconds
    const processStatusInterval = setInterval(checkProcessStatus, 500);
  })
  .catch(error => {
    console.error('Error submitting request for further processing:', error);
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
              const statusInterval = setInterval(checkStatus, 2);
            })
            .catch(error => {
              console.error('Error during initial transcription request:', error);
            });
         // audioElement.play();
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