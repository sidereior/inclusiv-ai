


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
{
"changes_description": "A greeting and brief description of the changes made to the page to make it more accessible to the user.", 
"user_data": {
  "user_info": {
    "colorblind": "n/a OR red-green OR blue-black",
    "adhd": "true OR false",
    "dyslexia": "true OR false"
  },
  "user_requests": ["explainPage", "magnifyPage", "unMagnifyPage"]
}`;
const promptText = `You are tasked with taking what a user said and determining which json values for each field it should have. Users give you a brief description of any accessibility needs they may have, and you must fit what they say to json values for each part of the json format and give a brief greeting and 1 sentence description of which accessibility tools youre enabling for them. 
The json should be in the format of: ${jsonString} . Here is what the user said, and you must strictly adhere to this in order to determine which values to give for the json fields:  ${response.result} YOUR RESPONSE MUST BE IN THE FORMAT OF A JSON OBJECT. YOU CAN ONLY USE THE USER DATA PROVIDED TO YOU AND NOTHING ELSE. .
YOU ARE ONLY ALLOWED TO RETURN SOMETHING FOR THE user_requests FIELD IF IT IS EXPLICELY METIONED BY THE USER TO EITHER EXPLAIN THE PAGE, MANGNIFY, OR UNMAGNIFY THE PAGE. IF NONE OF THESE ARE MENTIONED RETURN NOTHING FOR THE user_requests FIELD. Finally, your one sentence description must begin with a brief greeting and then describe the tools which you are enabling for the user based upon which values you are setting for the user_info and user_requetsts fields. You must not forget to greet the user in a happy way! Be nice!
For the changes_description you must base what you say here on the values in which you set for the user_info and user_requests fields. This is extremely important that the changes_description is just a reiteration of the user_info and user_requests fields, only in a more human readable format. DO NOT INFER ANYTHING ABOUT ANY OF THE ACCESSIBILITY TOOLS. ONLY JUST STATE THE NAMES OF THE TOOLS AND THE USERS CAN UNDERSTAND WHAT THEY DO.
Be logical, think through your ideas, and return this json object only.`;

// RETURN BACK TO THIS AND MAKE A HANDFUL OF SENTENCES THAT ARE THE DESCRIPTIONS OF EACH OF THE TOOLS AND THEN ADD THESE IN so it can describe stuff better

const options3 = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjE4ZGIzN2I0MmU5ZTU4OTllNzI1OWM4NzZhZWUwZjAzIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6MTk6MjAuMzg3NzExIn0.XMGqFSpcgakTSAD2TSnSdnWdO15jQhMwErctkp8PUTo'

    
  },
  //make this less tso that it is more deteminintics
  body: JSON.stringify({
    prompt: promptText,
    beam_size: 3,
    max_length: 256,
    repetition_penalty: 1.2,
    temp: 0.1,
    top_k: 40,
    top_p: 0.7
  })
};

fetch('https://api.monsterapi.ai/v1/generate/codellama-13b-instruct', options3)
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
        .then(response => {
          console.log("Process ID:", processId);
          console.log("Status:", response.status);

          if (response.status === "COMPLETED" || response.status === "FAILED") {
            clearInterval(processStatusInterval); // Stop checking
            if (response.status === "COMPLETED") {
              const firstBraceIndex = jsonString.indexOf('{');
              const validJsonString = jsonString.slice(firstBraceIndex);
              console.log("PRE TEXT TO SPEECH Processing Completed:", response.result);
              const resultJSON = JSON.parse(validJsonString);
              if (resultJSON.changes_description) {
                textToSpeech(resultJSON.changes_description);
              } else {
                console.log("No changes_description found in response.");
              }


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
    const processStatusInterval = setInterval(checkProcessStatus, 2000);
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
              const statusInterval = setInterval(checkStatus, 2000);
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
      const statusInterval = setInterval(checkStatus, 2000);
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


textToSpeech("Hey there. I am Inclusive AI, your personal AI assistant. I can help you make your website more accessible. Just click on the mic and tell me what you accessiblity needs you have. Looking forward to helping you out!");