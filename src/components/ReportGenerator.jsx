import React from 'react'

function ReportGenerator({ recording }) {
  const generateReport = () => {
    const report = `
      <html>
        <head>
          <title>Interaction Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .interaction { margin-bottom: 20px; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>
          <h1>Interaction Report</h1>
          ${recording.interactions.map((interaction, index) => `
            <div class="interaction">
              <h2>Interaction ${index + 1}</h2>
              <p>Type: ${interaction.type}</p>
              <p>Target: ${interaction.target}</p>
              <p>Timestamp: ${interaction.timestamp}</p>
              <img src="${recording.screenshots[index]}" alt="Screenshot ${index + 1}">
            </div>
          `).join('')}
        </body>
      </html>
    `

    const blob = new Blob([report], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    chrome.downloads.download({
      url: url,
      filename: `interaction_report_${new Date().toISOString()}.html`
    })
  }

  return (
    <div className="report-generator">
      <h2>Report Generator</h2>
      <button onClick={generateReport}>Generate and Download Report</button>
    </div>
  )
}

export default ReportGenerator