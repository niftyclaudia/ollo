import { EmptyState } from './EmptyState';

interface PreviewPanelProps {
  className?: string;
}

/**
 * Preview Panel - Center panel (40% width) for video playback and preview
 * Currently shows empty state placeholder
 * Future: Will display video player with playback controls
 */
export const PreviewPanel = ({ className = "" }: PreviewPanelProps) => {
  return (
    <div className={`preview-panel ${className}`}>
      <div className="preview-panel-header">
        <h2 className="preview-panel-title">Preview</h2>
      </div>
      
      <div className="preview-panel-content">
        <EmptyState message="Select a video from Library to preview" />
      </div>
    </div>
  );
};