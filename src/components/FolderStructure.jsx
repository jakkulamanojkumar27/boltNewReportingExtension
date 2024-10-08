import React, { useState, useEffect } from 'react'

function FolderStructure() {
  const [folderStructure, setFolderStructure] = useState({ Reports: {} })

  useEffect(() => {
    chrome.storage.local.get(['folderStructure'], (result) => {
      if (result.folderStructure) {
        setFolderStructure(result.folderStructure)
      }
    })
  }, [])

  const addFolder = (path) => {
    const newStructure = { ...folderStructure }
    let current = newStructure
    const parts = path.split('/')
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]]
    }
    current[parts[parts.length - 1]] = {}
    setFolderStructure(newStructure)
    chrome.storage.local.set({ folderStructure: newStructure })
  }

  const renderFolder = (folder, path = '') => {
    return (
      <ul>
        {Object.keys(folder).map((key) => (
          <li key={key}>
            {key}
            {Object.keys(folder[key]).length > 0 && renderFolder(folder[key], `${path}/${key}`)}
          </li>
        ))}
        <li>
          <button onClick={() => addFolder(`${path}/New Folder`)}>Add Folder</button>
        </li>
      </ul>
    )
  }

  return (
    <div className="folder-structure">
      <h2>Folder Structure</h2>
      {renderFolder(folderStructure)}
    </div>
  )
}

export default FolderStructure