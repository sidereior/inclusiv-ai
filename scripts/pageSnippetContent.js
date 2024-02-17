function fullTabScreenshot(callback) {
  chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl) {
    var img = new Image();
    img.src = dataUrl;
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = img.width; 
      canvas.height = img.height; 
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var finalDataUrl = canvas.toDataURL("image/png");
      callback(finalDataUrl); 
    };
  });
}

function enableSelectionAndCropping() {
  fullTabScreenshot(function(dataUrl) {
    // Use the captured full tab screenshot
    var img = new Image();
    img.src = dataUrl;
    img.onload = function() {
      // Prepare canvas for selection
      var canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      var isMouseDown = false;
      var rect = {}; // Object to store the start point and size of the rectangle

      // Implement mouse event listeners for drawing the selection rectangle
      canvas.addEventListener('mousedown', function(e) {
        rect.startX = e.offsetX;
        rect.startY = e.offsetY;
        isMouseDown = true;
      });

      canvas.addEventListener('mousemove', function(e) {
        if (isMouseDown) {
          // Re-draw the image and the selection rectangle
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          rect.w = e.offsetX - rect.startX;
          rect.h = e.offsetY - rect.startY;
          ctx.setLineDash([6]);
          ctx.strokeStyle = '#FF0000';
          ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        }
      });

      canvas.addEventListener('mouseup', function(e) {
        isMouseDown = false;
        // Finalize the selection rectangle and crop the image
        cropImage(ctx, rect);
      });
    };
  });
}

document.addEventListener('keydown', function(e) {
  // Check if the 'S' key is pressed without any modifiers
  if (e.key === 's' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
    enableSelectionAndCropping();
  }
});

function cropImage(ctx, rect) {
  // Adjust rect dimensions for reverse selection
  if (rect.w < 0) {
    rect.startX += rect.w;
    rect.w = Math.abs(rect.w);
  }
  if (rect.h < 0) {
    rect.startY += rect.h;
    rect.h = Math.abs(rect.h);
  }

  // Extract the selected part of the image
  var imageData = ctx.getImageData(rect.startX, rect.startY, rect.w, rect.h);
  var cropCanvas = document.createElement('canvas');
  cropCanvas.width = rect.w;
  cropCanvas.height = rect.h;
  var cropCtx = cropCanvas.getContext('2d');
  cropCtx.putImageData(imageData, 0, 0);

  // Convert cropped area to data URL or handle as needed
  var finalCroppedUrl = cropCanvas.toDataURL('image/png');
  // need to send this to openai and return the summary
}

enableSelectionAndCropping();
