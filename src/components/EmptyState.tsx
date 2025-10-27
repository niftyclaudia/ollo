interface EmptyStateProps {
  message?: string;
  className?: string;
}

/**
 * Reusable empty state component for displaying guidance when no content is available
 * Used in Library panel and other areas where user needs to import content
 */
export const EmptyState = ({ 
  message = "Drag video files here or click to import",
  className = ""
}: EmptyStateProps) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
        </div>
        <p className="empty-state-message">{message}</p>
      </div>
    </div>
  );
};