import React from 'react'

function RecordingControls({ isRecording, onStart, onStop }) {
  return (
    <div className="recording-controls">
      {isRecording ? (
        <button onClick={onStop}>Stop Recording</button>
      ) : (
        <button onClick={onStart}>Start Recording</button>
      )}
    </div>
  )
}

export default RecordingControls