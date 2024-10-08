import React, { useState, useRef, useEffect } from 'react'

function AnnotationTool({ imageUrl, annotations, onSave }) {
  const [currentAnnotations, setCurrentAnnotations] = useState(annotations)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentAnnotation, setCurrentAnnotation] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      drawAnnotations()
    }
    img.src = imageUrl
  }, [imageUrl])

  const drawAnnotations = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    currentAnnotations.forEach(annotation => {
      ctx.beginPath()
      ctx.moveTo(annotation.startX, annotation.startY)
      ctx.lineTo(annotation.endX, annotation.endY)
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    setIsDrawing(true)
    setCurrentAnnotation({ startX: offsetX, startY: offsetY, endX: offsetX, endY: offsetY })
  }

  const draw = (e) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = e.nativeEvent
    setCurrentAnnotation(prev => ({ ...prev, endX: offsetX, endY: offsetY }))
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(currentAnnotation.startX, currentAnnotation.startY)
    ctx.lineTo(offsetX, offsetY)
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  const endDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      setCurrentAnnotations([...currentAnnotations, currentAnnotation])
      onSave([...currentAnnotations, currentAnnotation])
    }
  }

  return (
    <div className="annotation-tool">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
      />
    </div>
  )
}

export default AnnotationTool