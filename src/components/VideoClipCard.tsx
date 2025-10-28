import { VideoClip } from '../types/AppState';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useCustomDrag } from '../contexts/CustomDragContext';

interface VideoClipCardProps {
  clip: VideoClip;
  onClick?: () => void;
  isSelected?: boolean;
  onDragStart?: (clip: VideoClip) => void;
}

/**
 * VideoClipCard - Individual clip display with thumbnail, filename, duration
 * Shows video clip information in the Library panel
 */
export const VideoClipCard = ({ clip, onClick, isSelected = false, onDragStart }: VideoClipCardProps) => {
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  const { startDrag } = useCustomDrag();

  // Load thumbnail as data URL when component mounts
  useEffect(() => {
    if (clip.thumbnail && !thumbnailDataUrl && !thumbnailError) {
      invoke<string>('get_thumbnail_data_url', { thumbnailPath: clip.thumbnail })
        .then(setThumbnailDataUrl)
        .catch((error) => {
          console.error('Failed to load thumbnail:', error);
          setThumbnailError(true);
        });
    }
  }, [clip.thumbnail, thumbnailDataUrl, thumbnailError]);
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`;
    }
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onDragStart && e.button === 0) { // Left mouse button only
      if (onDragStart) {
        onDragStart(clip);
      }
      startDrag(clip, { x: e.clientX, y: e.clientY });
      e.preventDefault(); // Prevent text selection
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className="video-clip-card"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        cursor: onClick ? 'pointer' : onDragStart ? 'grab' : 'default',
        border: isSelected ? '2px solid #007bff' : '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        backgroundColor: isSelected ? '#f0f8ff' : '#fff',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick && !isSelected) {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
          e.currentTarget.style.borderColor = '#007bff';
        }
        if (onDragStart) {
          e.currentTarget.style.cursor = 'grab';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick && !isSelected) {
          e.currentTarget.style.backgroundColor = '#fff';
          e.currentTarget.style.borderColor = '#e0e0e0';
        }
        if (onDragStart) {
          e.currentTarget.style.cursor = 'grab';
        }
      }}
    >
      {/* Thumbnail */}
      <div 
        className="clip-thumbnail"
        style={{
          width: '100%',
          height: '120px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {thumbnailDataUrl ? (
          <img 
            src={thumbnailDataUrl}
            alt={clip.filename}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : thumbnailError ? (
          <span style={{ fontSize: '24px', color: '#666' }}>🎬</span>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '12px',
            color: '#999'
          }}>
            Loading...
          </div>
        )}
      </div>

      {/* Filename */}
      <div 
        className="clip-filename"
        style={{
          fontWeight: '500',
          fontSize: '14px',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={clip.filename}
      >
        {clip.filename}
      </div>

      {/* Duration and file size */}
      <div 
        className="clip-metadata"
        style={{
          fontSize: '12px',
          color: '#666',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{formatDuration(clip.duration)}</span>
        <span>{formatFileSize(clip.metadata.fileSize)}</span>
      </div>

      {/* Additional metadata (hidden by default, can be expanded) */}
      <div 
        className="clip-details"
        style={{
          fontSize: '11px',
          color: '#888',
          marginTop: '4px',
        }}
      >
        {clip.metadata.width}×{clip.metadata.height} • {clip.metadata.framerate.toFixed(1)}fps • {clip.metadata.codec}
      </div>
    </div>
  );
};
