// Initialize the zoom level
var zoomLevel = 100;

// Function to increase the zoom level by 25%
function increaseZoom() {
    if (zoomLevel < 200) {
        zoomLevel += 25;
        document.body.style.zoom = zoomLevel + '%';
    }
}

// Function to decrease the zoom level by 25%
function decreaseZoom() {
    if (zoomLevel > 25) {
        zoomLevel -= 25;
        document.body.style.zoom = zoomLevel + '%';
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('got message', message);
    increaseZoom()
    if (message?.action === 'magnifyPage') {
        increaseZoom();

    } else if (message?.action === 'unMagnifyPage') {
        decreaseZoom();
    }

    return true;
}
)


