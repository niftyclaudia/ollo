import { LibraryPanel } from './components/LibraryPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { TimelinePanel } from './components/TimelinePanel';
import { useAppState } from './hooks/useAppState';
import './App.css';

/**
 * Main App component implementing three-panel layout for ollo video editor
 * Layout: Library (20%) | Preview (40%) | Timeline (30% height)
 */
function App() {
  const { appState, launchState } = useAppState();

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

export default App;