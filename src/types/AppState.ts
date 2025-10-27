// Initial app state structure for ollo video editor
export interface AppState {
  // Window configuration
  windowSize: {
    width: number;  // 1200px default
    height: number; // 800px default
    minWidth: number; // 1280px
    minHeight: number; // 720px
  };
  
  // UI state
  isAppReady: boolean;
  hasError: boolean;
  errorMessage?: string;
  
  // Layout state (for future features)
  library: VideoClip[]; // Empty initially
  timeline: TimelineClip[]; // Empty initially
  selectedClipId: string | null; // null initially
}

// Placeholder interfaces for future video editing features
export interface VideoClip {
  id: string;
  filePath: string;
  fileName: string;
  duration: number;
  thumbnail?: string;
}

export interface TimelineClip {
  id: string;
  clipId: string;
  startTime: number;
  endTime: number;
  order: number;
}

// Window configuration types
export interface WindowConfig {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  resizable: boolean;
  title: string;
  center: boolean;
}

// App launch state for initialization
export interface AppLaunchState {
  isReady: boolean;
  windowSize: { width: number; height: number };
  error: string | null;
}
