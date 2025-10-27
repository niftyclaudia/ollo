import { EmptyState } from './EmptyState';

interface TimelinePanelProps {
  className?: string;
}

/**
 * Timeline Panel - Bottom panel (30% height) for video editing timeline
 * Currently shows empty state placeholder
 * Future: Will display timeline with clips, playhead, and editing controls
 */
export const TimelinePanel = ({ className = "" }: TimelinePanelProps) => {
  return (
    <div className={`timeline-panel ${className}`}>
      <div className="timeline-panel-header">
        <h2 className="timeline-panel-title">Timeline</h2>
      </div>
      
      <div className="timeline-panel-content">
        <EmptyState message="Drag clips from Library to start editing" />
      </div>
    </div>
  );
};