import { LibraryPanel } from './components/LibraryPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { TimelinePanel } from './components/TimelinePanel';
import { useAppState } from './hooks/useAppState';
import { useVideoImport } from './contexts/VideoImportContext';
import { VideoImportProvider } from './contexts/VideoImportContext';
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import './App.css';

/**
 * Inner App component that uses the VideoImport context
 */
function AppContent() {
  const { appState, launchState } = useAppState();
  const { importFiles } = useVideoImport();

  // Listen for Tauri file drop events
  useEffect(() => {
    const unlisten = listen<string[]>('file-drop', async (event) => {
      const filePaths = event.payload;
      
      // Filter for video files
      const videoFiles = filePaths.filter(path => {
        const fileName = path.toLowerCase();
        return fileName.endsWith('.mp4') || fileName.endsWith('.mov');
      });
      
      if (videoFiles.length > 0) {
        // Import the files using the existing import logic
        try {
          await importFiles(videoFiles);
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
          <p>Failed to initialize application</p>
          <p className="error-message">{appState.errorMessage}</p>
        </div>
      </div>
    );
  }

  // Main three-panel layout
  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">ollo</h1>
      </div>
      
      <div className="app-main">
        <div className="app-panels">
          <LibraryPanel />
          <PreviewPanel />
        </div>
        <TimelinePanel />
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
      <AppContent />
    </VideoImportProvider>
  );
}

export default App;