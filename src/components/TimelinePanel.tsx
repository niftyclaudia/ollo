import { EmptyState } from './EmptyState';
import { useState, useCallback, useRef, useEffect } from 'react';
import { VideoClip } from '../types/AppState';
import { useCustomDrag } from '../contexts/CustomDragContext';
import { useVideoImport } from '../contexts/VideoImportContext';

interface TimelinePanelProps {
  className?: string;
}

/**
 * Timeline Panel - Bottom panel (30% height) for video editing timeline
 * Supports drag-and-drop from library to build video sequence
 */
export const TimelinePanel = ({ className = "" }: TimelinePanelProps) => {
  const [timelineClips, setTimelineClips] = useState<VideoClip[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const { dragState, endDrag } = useCustomDrag();
  const { clips } = useVideoImport();
  const panelRef = useRef<HTMLDivElement>(null);

  // Listen for external file drops on timeline (from Finder/Explorer)
  useEffect(() => {
    const handleExternalDrop = (event: Event) => {
      const customEvent = event as CustomEvent<{ filePaths: string[] }>;
      const { filePaths } = customEvent.detail;
      
      // Find the clips that were just imported (match by path)
      // Use a small delay to ensure clips are in the library
      setTimeout(() => {
        const importedClips = clips.filter(clip => 
          filePaths.some(path => clip.path === path)
        );
        
        // Add each imported clip to timeline with unique ID
        importedClips.forEach(clip => {
          const timelineClip = {
            ...clip,
            id: `${clip.id}-${Date.now()}-${Math.random()}`
          };
          setTimelineClips(prev => [...prev, timelineClip]);
        });
      }, 500); // Small delay to ensure import is complete
    };

    window.addEventListener('external-files-imported-to-timeline', handleExternalDrop);
    
    return () => {
      window.removeEventListener('external-files-imported-to-timeline', handleExternalDrop);
    };
  }, [clips]);

  // Handle mouse up - this is where we detect the drop from library
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (dragState.isDragging && dragState.draggedClip) {
      // Add clip to timeline with a unique ID for this timeline instance
      const timelineClip = {
        ...dragState.draggedClip,
        id: `${dragState.draggedClip.id}-${Date.now()}`
      };
      
      setTimelineClips(prev => [...prev, timelineClip]);
      endDrag();
    }
  }, [dragState, endDrag]);

  return (
    <div className={`timeline-panel ${className}`}>
      <div className="timeline-panel-header">
        <h2 className="timeline-panel-title">Timeline</h2>
        {timelineClips.length > 0 && (
          <div className="timeline-stats">
            {timelineClips.length} clip{timelineClips.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <div 
        ref={panelRef}
        className="timeline-panel-content"
        onMouseUp={handleMouseUp}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          position: 'relative',
          backgroundColor: (dragState.isDragging && isHovering) ? '#e3f2fd' : 'transparent',
          border: (dragState.isDragging && isHovering) ? '2px dashed #2196f3' : '2px dashed transparent',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          minHeight: '200px',
          pointerEvents: 'auto',
          zIndex: 1,
        }}
      >
        {/* Drag overlay */}
        {(dragState.isDragging && isHovering) && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
              border: '3px dashed #2196f3',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '600',
              color: '#2196f3',
              zIndex: 10,
              animation: 'pulse 1s infinite',
            }}
          >
            🎯 DROP VIDEO CLIP HERE! 🎯
          </div>
        )}

        {timelineClips.length > 0 ? (
          <div style={{ padding: '16px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              {timelineClips.map((clip, index) => {
                // Truncate filename if too long
                const shortName = clip.filename.length > 20 
                  ? clip.filename.substring(0, 17) + '...' 
                  : clip.filename;
                
                return (
                  <div
                    key={clip.id}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#e3f2fd',
                      border: '2px solid #2196f3',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#bbdefb';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    title={clip.filename} // Show full name on hover
                  >
                    <span>📹</span>
                    <span style={{ fontWeight: '500' }}>{shortName}</span>
                    <span style={{ fontSize: '11px', color: '#666', marginLeft: '4px' }}>
                      {Math.floor(clip.duration / 60)}:{(clip.duration % 60).toFixed(0).padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState message="Drag clips from Library to start editing" />
        )}
      </div>
    </div>
  );
};