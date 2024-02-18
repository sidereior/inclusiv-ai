const response = 'This page is a basic page with no special features.';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'explainPage') {
        chrome.tabs.captureVisibleTab().then((dataUrl) => {
            sendResponse({
                message: response,
                dataUrl: dataUrl
            })
        });
    }
  });