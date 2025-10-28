import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { VideoClip, ImportValidation } from '../types/AppState';

interface ImportState {
  isImporting: boolean;
  importProgress: number;
  error: string | null;
  clips: VideoClip[];
  selectedClipId: string | null;
}

interface VideoImportContextType {
  // State
  clips: VideoClip[];
  isImporting: boolean;
  importProgress: number;
  error: string | null;
  selectedClipId: string | null;
  
  // Actions
  importFiles: (filePaths: string[]) => Promise<void>;
  importFromFiles: (files: FileList) => Promise<void>;
  clearError: () => void;
  removeClip: (clipId: string) => void;
  clearLibrary: () => void;
  selectClip: (clipId: string | null) => void;
}

const VideoImportContext = createContext<VideoImportContextType | undefined>(undefined);

interface VideoImportProviderProps {
  children: ReactNode;
}

export const VideoImportProvider = ({ children }: VideoImportProviderProps) => {
  const [state, setState] = useState<ImportState>({
    isImporting: false,
    importProgress: 0,
    error: null,
    clips: [],
    selectedClipId: null,
  });

  // Auto-save library state every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.clips.length > 0) {
        try {
          // Save library state to local storage as backup
          localStorage.setItem('ollo-library-state', JSON.stringify(state.clips));
        } catch (error) {
          console.warn('Failed to save library state:', error);
        }
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [state.clips]);

  // Load library state on startup
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('ollo-library-state');
      if (savedState) {
        const clips = JSON.parse(savedState) as VideoClip[];
        setState(prev => ({ ...prev, clips }));
      }
    } catch (error) {
      console.warn('Failed to load library state:', error);
    }
  }, []);

  const validateFile = useCallback(async (filePath: string): Promise<ImportValidation> => {
    try {
      const validation = await invoke<ImportValidation>('validate_video_file', { filePath });
      return validation;
    } catch (error) {
      return {
        isValidFormat: false,
        isWithinSizeLimit: false,
        errorMessage: `Validation failed: ${error}`,
      };
    }
  }, []);

  const createVideoClip = useCallback(async (filePath: string): Promise<VideoClip> => {
    try {
      const clip = await invoke<VideoClip>('create_video_clip', { filePath });
      return clip;
    } catch (error) {
      throw new Error(`Failed to create video clip: ${error}`);
    }
  }, []);

  const importFile = useCallback(async (filePath: string) => {
    setState(prev => ({ ...prev, isImporting: true, error: null }));

    try {
      // Validate file first
      const validation = await validateFile(filePath);
      if (!validation.isValidFormat || !validation.isWithinSizeLimit) {
        throw new Error(validation.errorMessage || 'Invalid file');
      }

      // Create video clip
      const clip = await createVideoClip(filePath);
      
      setState(prev => ({
        ...prev,
        clips: [...prev.clips, clip],
        isImporting: false,
        importProgress: 0,
      }));
    } catch (error) {
      console.error('Import file error:', error);
      setState(prev => ({
        ...prev,
        isImporting: false,
        error: error instanceof Error ? error.message : 'Import failed',
        importProgress: 0,
      }));
    }
  }, [validateFile, createVideoClip]);

  const importFiles = useCallback(async (filePaths: string[]) => {
    setState(prev => ({ ...prev, isImporting: true, error: null, importProgress: 0 }));

    const totalFiles = filePaths.length;
    let completedFiles = 0;

    for (const filePath of filePaths) {
      try {
        await importFile(filePath);
        completedFiles++;
        setState(prev => ({
          ...prev,
          importProgress: Math.round((completedFiles / totalFiles) * 100),
        }));
      } catch (error) {
        console.error(`Failed to import ${filePath}:`, error);
        // Continue with other files even if one fails
      }
    }

    setState(prev => ({
      ...prev,
      isImporting: false,
      importProgress: 100,
    }));
  }, [importFile]);

  const importFromFiles = useCallback(async (files: FileList) => {
    setState(prev => ({ ...prev, isImporting: true, error: null, importProgress: 0 }));

    const totalFiles = files.length;
    let completedFiles = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // For HTML5 file input, we need to create a temporary file that Tauri can access
        // We'll use the file's name and create it in a temp directory
        const tempDir = await invoke<string>('get_temp_dir');
        const tempPath = `${tempDir}/${file.name}`;
        
        // Copy the file content to the temporary location
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Write the file to the temporary location
        await invoke('write_temp_file', { 
          filePath: tempPath, 
          data: Array.from(uint8Array) 
        });
        
        // Use the actual Tauri command to create the video clip
        const clip = await invoke<VideoClip>('create_video_clip', { filePath: tempPath });
        
        setState(prev => ({
          ...prev,
          clips: [...prev.clips, clip],
        }));

        completedFiles++;
        setState(prev => ({
          ...prev,
          importProgress: Math.round((completedFiles / totalFiles) * 100),
        }));
      } catch (error) {
        console.error(`Failed to import ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }

    setState(prev => ({
      ...prev,
      isImporting: false,
      importProgress: 100,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const removeClip = useCallback((clipId: string) => {
    setState(prev => ({
      ...prev,
      clips: prev.clips.filter(clip => clip.id !== clipId),
    }));
  }, []);

  const clearLibrary = useCallback(() => {
    setState(prev => ({
      ...prev,
      clips: [],
      error: null,
      selectedClipId: null,
    }));
  }, []);

  const selectClip = useCallback((clipId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedClipId: clipId,
    }));
  }, []);

  const value: VideoImportContextType = {
    clips: state.clips,
    isImporting: state.isImporting,
    importProgress: state.importProgress,
    error: state.error,
    selectedClipId: state.selectedClipId,
    importFiles,
    importFromFiles,
    clearError,
    removeClip,
    clearLibrary,
    selectClip,
  };

  return (
    <VideoImportContext.Provider value={value}>
      {children}
    </VideoImportContext.Provider>
  );
};

export const useVideoImport = () => {
  const context = useContext(VideoImportContext);
  if (context === undefined) {
    throw new Error('useVideoImport must be used within a VideoImportProvider');
  }
  return context;
};
