console.log('Content script loaded');

let isRecording = false;
let interactions = [];

function recordInteraction(event) {
  if (!isRecording) return;

  const interaction = {
    type: event.type,
    target: event.target.tagName,
    timestamp: new Date().toISOString(),
    x: event.clientX,
    y: event.clientY
  };

  interactions.push(interaction);
  chrome.runtime.sendMessage({ action: 'newInteraction', interaction });
}

['click', 'input', 'change', 'submit'].forEach(eventType => {
  document.addEventListener(eventType, recordInteraction, true);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
    isRecording = true;
    interactions = [];
  } else if (message.action === 'stopRecording') {
    isRecording = false;
    chrome.runtime.sendMessage({ action: 'recordingComplete', interactions });
  }
});