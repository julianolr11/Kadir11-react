import React from 'react'

export default function TitleBar() {
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
