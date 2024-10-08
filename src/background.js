chrome.runtime.onInstalled.addListener(() => {
  console.log('User Interaction Recorder extension installed');
  chrome.storage.local.set({ folderStructure: { Reports: {} } });
});

let currentTabId = null;
let currentRecording = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      currentTabId = tabs[0].id;
      currentRecording = { interactions: [], screenshots: [] };
      chrome.tabs.sendMessage(currentTabId, { action: 'startRecording' });
    });
  } else if (message.action === 'stopRecording') {
    if (currentTabId) {
      chrome.tabs.sendMessage(currentTabId, { action: 'stopRecording' });
    }
  } else if (message.action === 'newInteraction') {
    if (currentRecording) {
      currentRecording.interactions.push(message.interaction);
      takeScreenshot();
    }
  } else if (message.action === 'recordingComplete') {
    console.log('Recording complete:', currentRecording);
    saveRecording(currentRecording);
    currentRecording = null;
  } else if (message.action === 'getRecordings') {
    const { page, itemsPerPage } = message;
    chrome.storage.local.get(['recordings'], (result) => {
      const allRecordings = result.recordings || [];
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedRecordings = allRecordings.slice(startIndex, endIndex);
      sendResponse({ recordings: paginatedRecordings });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (message.action === 'updateRecording') {
    updateRecording(message.recording);
  }
});

function takeScreenshot() {
  if (currentTabId) {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (currentRecording) {
        currentRecording.screenshots.push(dataUrl);
      }
    });
  }
}

function saveRecording(recording) {
  chrome.storage.local.get(['recordings'], (result) => {
    const recordings = result.recordings || [];
    recordings.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...recording
    });
    chrome.storage.local.set({ recordings });
  });
}

function updateRecording(updatedRecording) {
  chrome.storage.local.get(['recordings'], (result) => {
    const recordings = result.recordings || [];
    const index = recordings.findIndex(r => r.id === updatedRecording.id);
    if (index !== -1) {
      recordings[index] = updatedRecording;
      chrome.storage.local.set({ recordings });
    }
  });
}