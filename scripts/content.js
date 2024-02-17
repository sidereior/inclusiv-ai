// Function to fetch CSS file
function fetchCSS(url) {
    return fetch(url)
        .then(response => response.text())
        .catch(error => console.error('Error fetching CSS file:', error));
}

// Function to extract inline styles from HTML elements
function extractInlineStyles() {
    var inlineStyles = [];
    var elementsWithInlineStyles = document.querySelectorAll('[style]');
    elementsWithInlineStyles.forEach(function(element) {
        var inlineStyle = element.getAttribute('style');
        if (inlineStyle) {
            inlineStyles.push(inlineStyle);
        }
    });
    return inlineStyles.join('\n'); // Concatenate inline styles with newline separator
}

// Get all <link> elements with rel="stylesheet"
var linkElements = document.querySelectorAll('link[rel="stylesheet"]');
var cssContentArray = [];

// Fetch and extract external CSS files
Promise.all(Array.from(linkElements).map(linkElement => {
    var cssUrl = linkElement.getAttribute('href');
    return fetchCSS(cssUrl)
        .then(cssContent => {
            cssContentArray.push(cssContent);
        });
}))
.then(() => {
    // Extract inline styles
    var inlineStyles = extractInlineStyles();
    cssContentArray.push(inlineStyles);

    console.log('fetching jeetpt')
    // Concatenate all CSS content
    var allCSSContent = cssContentArray.join('\n'); // Concatenate CSS content with newline separator
    fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + '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'
                },
                body: JSON.stringify({
                  "model": "gpt-4-turbo-preview",
                  "messages": [
                    {
                      "role": "system",
                      "content": "You are an expert at generating css code."
                    },
                    {
                      "role": "user",
                      "content": `Generate in depth and comprehensive css code to make the following code of a website be accessible to red-green colorblind people. Increase color contrast between red and green elements by adjusting their hues, saturation, or brightness. Replace red and green color combinations with alternative colors that are easier to distinguish, such as blue and yellow. Don't rewrite the entire css only generate as little new css as possible. Use things like !important! to ensure it overrides, and ensure that the css will work properly and update the visuals of the site. Respond only with css code and nothing else in this format: <style>CODE GOES HERE</style>. Current CSS: ${allCSSContent}`
                    },
                  ]
                })
              })
              .then(response => response.json())
              .then(data => {
                console.log('jeetpt loaded')
                console.log(data);

                var cssCode = data.choices[0].message.content;
                var cssCodeCleaned = cssCode.replace('<style>', '').replace('</style>', '');
                var styleElement = document.createElement('style');
                styleElement.textContent = cssCodeCleaned;
                document.head.appendChild(styleElement);
              })
              
})

