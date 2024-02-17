document.addEventListener('DOMContentLoaded', function () {
    var toggle1 = document.getElementById('toggle1');
    var toggle2 = document.getElementById('toggle2');
  
    chrome.storage.sync.get(['toggle1', 'toggle2'], function(result) {
      toggle1.checked = result.toggle1;
      toggle2.checked = result.toggle2;
    });
  
    toggle1.addEventListener('change', function() {
      chrome.storage.sync.set({toggle1: toggle1.checked});
    });
  
    toggle2.addEventListener('change', function() {
      chrome.storage.sync.set({toggle2: toggle2.checked});
    });
  });
  