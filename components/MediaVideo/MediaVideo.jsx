import React from 'react'
import './MediaVideo.css'

export const MediaVideo = ({ channel, videoId }) => {
  return (
    <div className="embed-responsive embed-responsive-21by9 media-video-wrapper">
      <iframe
        title={videoId}
        className="embed-responsive-item media-video"
        src={`https://${channel}.com/embed/${videoId}`}
        allow="autoplay"
        allowFullScreen
      />
    </div>
  )
}

export default MediaVideo
