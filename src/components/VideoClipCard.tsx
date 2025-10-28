import { VideoClip } from '../types/AppState';

interface VideoClipCardProps {
  clip: VideoClip;
  onClick?: () => void;
}

/**
 * VideoClipCard - Individual clip display with thumbnail, filename, duration
 * Shows video clip information in the Library panel
 */
export const VideoClipCard = ({ clip, onClick }: VideoClipCardProps) => {
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

  return (
    <div 
      className="video-clip-card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
          e.currentTarget.style.borderColor = '#007bff';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = '#fff';
          e.currentTarget.style.borderColor = '#e0e0e0';
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
        {clip.thumbnail ? (
          <img 
            src={`file://${clip.thumbnail}`}
            alt={clip.filename}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              // Fallback to generic video icon if thumbnail fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '🎬';
            }}
          />
        ) : (
          <span style={{ fontSize: '24px', color: '#666' }}>🎬</span>
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
