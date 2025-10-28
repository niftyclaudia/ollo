import { EmptyState } from './EmptyState';
import { useVideoImport } from '../contexts/VideoImportContext';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface PreviewPanelProps {
  className?: string;
}

/**
 * Preview Panel - Center panel (40% width) for video playback and preview
 * Shows selected video clip with playback controls
 */
export const PreviewPanel = ({ className = "" }: PreviewPanelProps) => {
  const { clips, selectedClipId } = useVideoImport();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  
  const selectedClip = clips.find(clip => clip.id === selectedClipId);

  // Load video URL when selected clip changes
  useEffect(() => {
    if (selectedClip && selectedClip.path) {
      setIsLoadingVideo(true);
      setVideoError(false);
      setVideoUrl(null);
      
      invoke<string>('get_video_asset_url', { videoPath: selectedClip.path })
        .then((dataUrl) => {
          console.log('Video data URL generated, length:', dataUrl.length);
          setVideoUrl(dataUrl);
        })
        .catch((error) => {
          console.error('Failed to get video URL:', error);
          setVideoError(true);
        })
        .finally(() => {
          setIsLoadingVideo(false);
        });
    } else {
      setVideoUrl(null);
      setVideoError(false);
      setIsLoadingVideo(false);
    }
  }, [selectedClip]);

  return (
    <div className={`preview-panel ${className}`}>
      <div className="preview-panel-header">
        <h2 className="preview-panel-title">Preview</h2>
        {selectedClip && (
          <div className="preview-clip-info">
            {selectedClip.filename}
          </div>
        )}
      </div>
      
      <div className="preview-panel-content">
        {selectedClip ? (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            {isLoadingVideo ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <h3>Loading Video...</h3>
                <p>Please wait while the video loads</p>
              </div>
            ) : videoError ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                <h3>Video Preview Unavailable</h3>
                <p>Unable to load video file</p>
                <p style={{ fontSize: '12px', color: '#666' }}>{selectedClip.filename}</p>
              </div>
            ) : videoUrl ? (
              <>
                <video
                  src={videoUrl}
                  controls
                  preload="metadata"
                  style={{
                    width: '100%',
                    maxWidth: '600px',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                  onError={(e) => {
                    console.error('Video playback error:', e);
                    console.error('Video data URL length:', videoUrl?.length);
                    setVideoError(true);
                  }}
                  onLoadStart={() => {
                    console.log('Video loading started');
                  }}
                  onCanPlay={() => {
                    console.log('Video can play');
                  }}
                />
                <div style={{ 
                  marginTop: '16px', 
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <div><strong>{selectedClip.filename}</strong></div>
                  <div>{selectedClip.metadata.width}×{selectedClip.metadata.height} • {selectedClip.metadata.framerate.toFixed(1)}fps</div>
                  <div>{Math.floor(selectedClip.duration / 60)}:{(selectedClip.duration % 60).toFixed(0).padStart(2, '0')}</div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                <h3>Video Preview Unavailable</h3>
                <p>Unable to load video file</p>
                <p style={{ fontSize: '12px', color: '#666' }}>{selectedClip.filename}</p>
              </div>
            )}
          </div>
        ) : (
          <EmptyState message="Select a video from Library to preview" />
        )}
      </div>
    </div>
  );
};