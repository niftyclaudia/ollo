import { EmptyState } from './EmptyState';

interface LibraryPanelProps {
  className?: string;
}

/**
 * Library Panel - Left panel (20% width) for displaying imported video clips
 * Currently shows empty state with import guidance
 * Future: Will display list of imported video files with thumbnails
 */
export const LibraryPanel = ({ className = "" }: LibraryPanelProps) => {
  return (
    <div className={`library-panel ${className}`}>
      <div className="library-panel-header">
        <h2 className="library-panel-title">Library</h2>
      </div>
      
      <div className="library-panel-content">
        <EmptyState message="Drag & drop video files or click Import to get started" />
      </div>
    </div>
  );
};