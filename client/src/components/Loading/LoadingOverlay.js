import React from 'react'
import './Loading.css'

const Loading = ({ overlay }) => {
  return (
    <div className={`loading-container ${overlay ? 'overlay' : ''}`}>
    <div className="loading-spinner"></div>
  </div>
  )
}

export default Loading