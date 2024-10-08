import React, { useState, useEffect } from 'react'
import './App.css'
import RecordingControls from './components/RecordingControls'
import InteractionList from './components/InteractionList'
import ReportGenerator from './components/ReportGenerator'
import ReportEditor from './components/ReportEditor'
import FolderStructure from './components/FolderStructure'

const ITEMS_PER_PAGE = 20

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState([])
  const [selectedRecording, setSelectedRecording] = useState(null)
  const [view, setView] = useState('list') // 'list', 'edit', 'folder'
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadRecordings()
  }, [page])

  const loadRecordings = () => {
    chrome.runtime.sendMessage({ 
      action: 'getRecordings',
      page,
      itemsPerPage: ITEMS_PER_PAGE
    }, (response) => {
      if (response.recordings.length < ITEMS_PER_PAGE) {
        setHasMore(false)
      }
      setRecordings(prevRecordings => [...prevRecordings, ...response.recordings])
    })
  }

  const startRecording = () => {
    setIsRecording(true)
    chrome.runtime.sendMessage({ action: 'startRecording' })
  }

  const stopRecording = () => {
    setIsRecording(false)
    chrome.runtime.sendMessage({ action: 'stopRecording' })
    setTimeout(() => {
      setPage(1)
      setRecordings([])
      setHasMore(true)
      loadRecordings()
    }, 500)
  }

  const selectRecording = (recording) => {
    setSelectedRecording(recording)
    setView('edit')
  }

  const loadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1)
    }
  }

  return (
    <div className="App">
      <h1>User Interaction Recorder</h1>
      <nav>
        <button onClick={() => setView('list')}>Recordings</button>
        <button onClick={() => setView('folder')}>Folders</button>
      </nav>
      {view === 'list' && (
        <>
          <RecordingControls 
            isRecording={isRecording} 
            onStart={startRecording} 
            onStop={stopRecording} 
          />
          <InteractionList 
            recordings={recordings} 
            onSelectRecording={selectRecording} 
          />
          {hasMore && <button onClick={loadMore}>Load More</button>}
        </>
      )}
      {view === 'edit' && selectedRecording && (
        <ReportEditor 
          recording={selectedRecording} 
          onSave={(updatedRecording) => {
            // Implement saving logic
            chrome.runtime.sendMessage({ 
              action: 'updateRecording', 
              recording: updatedRecording 
            }, () => {
              setView('list')
              loadRecordings()
            })
          }} 
        />
      )}
      {view === 'folder' && (
        <FolderStructure />
      )}
    </div>
  )
}

export default App