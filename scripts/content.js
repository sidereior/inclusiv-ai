// Create a new <div> element
var divElement = document.createElement("div");

// Set the text content and styling for the <div>
divElement.textContent = "INKLUSIVE";
divElement.style.position = "fixed";
divElement.style.bottom = "0";
divElement.style.left = "0";
divElement.style.width = "100%";
divElement.style.backgroundColor = "purple";
divElement.style.color = "white";
divElement.style.fontSize = "24px";
divElement.style.padding = "10px";
divElement.style.textAlign = "center";
divElement.style.zIndex = "9999"; // Ensure the element appears above other content

// Append the <div> element to the <body> of the document
document.body.appendChild(divElement);
