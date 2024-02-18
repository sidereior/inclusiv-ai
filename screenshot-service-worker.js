const response = 'This page is a basic page with no special features.';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.action === 'explainPage') {
        chrome.tabs.captureVisibleTab().then((screenshotDataUrl) => {
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + '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'
                },
                body: JSON.stringify({
                  "model": "gpt-4-vision-preview",
                  
                  "messages": [
                    {
                        "role": "user",
                        "content": [
                          {"type": "text", "text": "You are a web accessibility partner. Based on the screenshot of the website, wescribe what is on this website for someone who's vision impaired, and how they can navigate it and what they can do with it. Be succint with your language, but explain things in depth and comprehensively so they can fully understand the website."},
                          {
                            "type": "image_url",
                            "image_url": {
                              "url": screenshotDataUrl,
                            },
                          },
                        ],
                      }
                  ]
                })
              })
              .then(response => response.json())
              .then(data => {    
                var response = data.choices[0].message.content;

                sendResponse({
                    text: response,
                })

            })


            
        });
    }
    return true;
  });