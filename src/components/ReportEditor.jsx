import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import AnnotationTool from './AnnotationTool'

function ReportEditor({ recording, onSave }) {
  const [editedRecording, setEditedRecording] = useState(recording)
  const [customNote, setCustomNote] = useState('')

  const handleInteractionChange = (index, field, value) => {
    const newInteractions = [...editedRecording.interactions]
    newInteractions[index] = { ...newInteractions[index], [field]: value }
    setEditedRecording({ ...editedRecording, interactions: newInteractions })
  }

  const handleScreenshotAnnotation = (index, annotationData) => {
    const newScreenshots = [...editedRecording.screenshots]
    newScreenshots[index] = { ...newScreenshots[index], annotationData }
    setEditedRecording({ ...editedRecording, screenshots: newScreenshots })
  }

  const handleCustomNoteChange = (e) => {
    setCustomNote(e.target.value)
  }

  const addCustomNote = () => {
    if (customNote.trim()) {
      const newInteractions = [...editedRecording.interactions, {
        type: 'custom_note',
        content: customNote,
        timestamp: new Date().toISOString()
      }]
      setEditedRecording({ ...editedRecording, interactions: newInteractions })
      setCustomNote('')
    }
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const newInteractions = Array.from(editedRecording.interactions)
    const [reorderedItem] = newInteractions.splice(result.source.index, 1)
    newInteractions.splice(result.destination.index, 0, reorderedItem)

    setEditedRecording({ ...editedRecording, interactions: newInteractions })
  }

  return (
    <div className="report-editor">
      <h2>Edit Report</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="interactions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="interactions">
              <h3>Interactions</h3>
              {editedRecording.interactions.map((interaction, index) => (
                <Draggable key={interaction.timestamp} draggableId={interaction.timestamp} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="interaction-item"
                    >
                      {interaction.type === 'custom_note' ? (
                        <textarea
                          value={interaction.content}
                          onChange={(e) => handleInteractionChange(index, 'content', e.target.value)}
                        />
                      ) : (
                        <>
                          <input
                            value={interaction.type}
                            onChange={(e) => handleInteractionChange(index, 'type', e.target.value)}
                          />
                          <input
                            value={interaction.target}
                            onChange={(e) => handleInteractionChange(index, 'target', e.target.value)}
                          />
                          <input
                            value={interaction.timestamp}
                            onChange={(e) => handleInteractionChange(index, 'timestamp', e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="custom-note">
        <h3>Add Custom Note</h3>
        <textarea
          value={customNote}
          onChange={handleCustomNoteChange}
          placeholder="Enter custom note..."
        />
        <button onClick={addCustomNote}>Add Note</button>
      </div>
      <div className="screenshots">
        <h3>Screenshots</h3>
        {editedRecording.screenshots.map((screenshot, index) => (
          <div key={index} className="screenshot-item">
            <AnnotationTool
              imageUrl={screenshot}
              annotations={screenshot.annotationData || []}
              onSave={(annotationData) => handleScreenshotAnnotation(index, annotationData)}
            />
          </div>
        ))}
      </div>
      <button onClick={() => onSave(editedRecording)}>Save Changes</button>
    </div>
  )
}

export default ReportEditor