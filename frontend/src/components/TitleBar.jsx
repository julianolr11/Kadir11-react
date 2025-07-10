import React, { useEffect, useState } from 'react'

export default function TitleBar() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  if (isFullscreen) return null

  const handleMinimize = () => window.api?.minimize()
  const handleMaximize = () => window.api?.toggleMaximize()
  const handleClose = () => window.api?.close()

  return (
    <div id="title-bar">
      <div id="title-bar-content">Kadir11</div>
      <div id="title-bar-buttons">
        <div className="title-btn minimize-btn" onClick={handleMinimize}>–</div>
        <div className="title-btn maximize-btn" onClick={handleMaximize}>▢</div>
        <div className="title-btn close-btn" onClick={handleClose}>×</div>
      </div>
    </div>
  )
}
