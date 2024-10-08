import React from 'react'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

function InteractionList({ recordings, onSelectRecording }) {
  const Row = ({ index, style }) => {
    const recording = recordings[index]
    return (
      <div style={style} onClick={() => onSelectRecording(recording)}>
        {new Date(recording.timestamp).toLocaleString()} - 
        {recording.interactions.length} interactions
      </div>
    )
  }

  return (
    <div className="interaction-list">
      <h2>Recorded Sessions</h2>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={recordings.length}
            itemSize={50}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  )
}

export default InteractionList