import { LibraryPanel } from './components/LibraryPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { TimelinePanel } from './components/TimelinePanel';
import { useAppState } from './hooks/useAppState';
import { useVideoImport } from './contexts/VideoImportContext';
import { VideoImportProvider } from './contexts/VideoImportContext';
import { CustomDragProvider } from './contexts/CustomDragContext';
import { useEffect, useCallback } from 'react';
import { listen } from '@tauri-apps/api/event';
import './App.css';

/**
 * Inner App component that uses the VideoImport context
 */
function AppContent() {
  const { appState, launchState } = useAppState();
  const { importFiles } = useVideoImport();

  // Listen for Tauri file drop events (from Finder/Explorer)
  // This handles EXTERNAL file drops with smart drop zones
  useEffect(() => {
    const unlisten = listen<{ paths: string[], position: { x: number, y: number } }>('file-drop-with-position', async (event) => {
      const { paths: filePaths, position } = event.payload;
      
      // Filter for video files
      const videoFiles = filePaths.filter(path => {
        const fileName = path.toLowerCase();
        return fileName.endsWith('.mp4') || fileName.endsWith('.mov');
      });
      
      if (videoFiles.length > 0) {
        // Determine which panel was dropped on based on position
        const timelinePanel = document.querySelector('.timeline-panel');
        const timelineRect = timelinePanel?.getBoundingClientRect();
        
        const isOverTimeline = timelineRect && 
          position.x >= timelineRect.left &&
          position.x <= timelineRect.right &&
          position.y >= timelineRect.top &&
          position.y <= timelineRect.bottom;
        
        // Import the files to library
        try {
          await importFiles(videoFiles);
          
          // If dropped on timeline, emit event so Timeline can auto-add clips
          if (isOverTimeline) {
            window.dispatchEvent(new CustomEvent('external-files-imported-to-timeline', {
              detail: { filePaths: videoFiles }
            }));
          }
        } catch (error) {
          console.error('Import failed:', error);
          alert(`Failed to import files: ${error}`);
        }
      } else {
        alert('Please drop MP4 or MOV video files only.');
      }
    });

    return () => {
      unlisten.then(unlistenFn => unlistenFn());
    };
  }, [importFiles]);

  // Show loading state during app initialization
  if (!launchState.isReady) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>ollo</h2>
          <p>Loading video editor...</p>
        </div>
      </div>
    );
  }

  // Show error state if app failed to initialize
  if (appState.hasError) {
    return (
      <div className="app-error">
        <div className="error-content">
          <h2>ollo</h2>
          <p className="error-message">{appState.errorMessage}</p>
          <button onClick={() => window.location.reload()}>
            Reload App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Main app content with three-panel layout */}
      <div className="app-main">
        <div className="app-panels">
          {/* Library Panel - 20% width */}
          <LibraryPanel className="panel" />
          
          {/* Preview Panel - 40% width */}
          <PreviewPanel className="panel" />
        </div>
        
        {/* Timeline Panel - Full width, 30% height */}
        <div className="timeline-container">
          <TimelinePanel />
        </div>
      </div>
    </div>
  );
}

/**
 * Main App component implementing three-panel layout for ollo video editor
 * Layout: Library (20%) | Preview (40%) | Timeline (30% height)
 */
function App() {
  return (
    <VideoImportProvider>
      <CustomDragProvider>
        <AppContent />
      </CustomDragProvider>
    </VideoImportProvider>
  );
}

export default App;
