import { useState, useCallback } from 'react';
import { EmptyState } from './EmptyState';
import { VideoClipCard } from './VideoClipCard';
import { ImportButton } from './ImportButton';
import { useVideoImport } from '../contexts/VideoImportContext';

interface LibraryPanelProps {
  className?: string;
}

/**
 * Library Panel - Left panel (20% width) for displaying imported video clips
 * Supports drag-and-drop import and file picker import
 * Displays video clips with thumbnails, filenames, and durations
 */
export const LibraryPanel = ({ className = "" }: LibraryPanelProps) => {
  const { clips, isImporting, importProgress, error, importFromFiles, clearError } = useVideoImport();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);

    // More lenient filtering - check by extension if MIME type is not available
    const videoFiles = files.filter(file => {
      const hasVideoMimeType = file.type.startsWith('video/');
      const hasVideoExtension = file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.mov');
      return hasVideoMimeType || hasVideoExtension;
    });

    if (videoFiles.length === 0) {
      alert('Please drop MP4 or MOV video files only.');
      return;
    }
    
    // Convert File[] to FileList-like object
    const fileList = {
      length: videoFiles.length,
      item: (index: number) => videoFiles[index] || null,
      [Symbol.iterator]: function* () {
        for (let i = 0; i < videoFiles.length; i++) {
          yield videoFiles[i];
        }
      }
    } as FileList;

    // Use the same import function as the file picker
    try {
      await importFromFiles(fileList);
    } catch (error) {
      console.error('Import failed:', error);
    }
  }, [importFromFiles]);

  const handleImportClick = useCallback((files: FileList) => {
    importFromFiles(files);
  }, [importFromFiles]);

  const handleClipClick = useCallback((clipId: string) => {
    // Future: Handle clip selection for timeline
  }, []);

  return (
    <div className={`library-panel ${className}`}>
      <div className="library-panel-header">
        <h2 className="library-panel-title">Library</h2>
        {clips.length > 0 && (
          <div className="library-stats">
            {clips.length} clip{clips.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <div 
        className="library-panel-content"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          backgroundColor: isDragOver ? '#e3f2fd' : 'transparent',
          border: isDragOver ? '2px dashed #2196f3' : '2px dashed transparent',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          minHeight: '200px',
        }}
      >
        {/* Drag and drop overlay */}
        {isDragOver && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              border: '2px dashed #2196f3',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '500',
              color: '#2196f3',
              zIndex: 10,
            }}
          >
            Drop video files here
          </div>
        )}
        {/* Import button */}
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <ImportButton 
            onImport={handleImportClick}
            disabled={isImporting}
          />
        </div>

        {/* Error display */}
        {error && (
          <div 
            style={{
              padding: '12px',
              margin: '0 16px',
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '4px',
              color: '#c62828',
              fontSize: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{error}</span>
              <button
                onClick={clearError}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#c62828',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isImporting && (
          <div 
            style={{
              padding: '16px',
              textAlign: 'center',
              backgroundColor: '#f5f5f5',
              margin: '0 16px',
              borderRadius: '4px',
            }}
          >
            <div style={{ marginBottom: '8px' }}>Importing videos...</div>
            <div 
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: '#e0e0e0',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div 
                style={{
                  width: `${importProgress}%`,
                  height: '100%',
                  backgroundColor: '#2196f3',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {importProgress}%
            </div>
          </div>
        )}

        {/* Clips list */}
        {clips.length > 0 ? (
          <div style={{ padding: '0 16px 16px' }}>
            {clips.map((clip) => (
              <VideoClipCard
                key={clip.id}
                clip={clip}
                onClick={() => handleClipClick(clip.id)}
              />
            ))}
          </div>
        ) : !isImporting && (
          <EmptyState message="Drag & drop video files or click Import to get started" />
        )}

        {/* Drag overlay */}
        {isDragOver && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              pointerEvents: 'none',
            }}
          >
            <div 
              style={{
                backgroundColor: '#2196f3',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              Drop video files here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};