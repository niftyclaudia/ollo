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

// Video clip data structure for import & library functionality
export interface VideoClip {
  id: string; // UUID
  path: string; // File system path
  filename: string; // Display name
  duration: number; // Duration in seconds
  thumbnail: string; // Path to thumbnail image
  metadata: VideoMetadata;
  importedAt: Date; // Timestamp
}

// Video metadata extracted using FFmpeg
export interface VideoMetadata {
  width: number;
  height: number;
  framerate: number;
  codec: string;
  fileSize: number; // Bytes
}

// Import validation result
export interface ImportValidation {
  isValidFormat: boolean;
  isWithinSizeLimit: boolean;
  errorMessage?: string;
}

// Library state for import operations
export interface LibraryState {
  clips: VideoClip[];
  isImporting: boolean;
  importProgress: number; // 0-100
  error: string | null;
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
