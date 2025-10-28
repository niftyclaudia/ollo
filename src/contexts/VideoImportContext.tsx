import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { VideoClip, ImportValidation } from '../types/AppState';

interface ImportState {
  isImporting: boolean;
  importProgress: number;
  error: string | null;
  clips: VideoClip[];
}

interface VideoImportContextType {
  // State
  clips: VideoClip[];
  isImporting: boolean;
  importProgress: number;
  error: string | null;
  
  // Actions
  importFiles: (filePaths: string[]) => Promise<void>;
  importFromFiles: (files: FileList) => Promise<void>;
  clearError: () => void;
  removeClip: (clipId: string) => void;
  clearLibrary: () => void;
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
  });

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
        // For HTML5 file input, we need to create a temporary file path
        // In a real Tauri app, we'd need to copy the file to a temp location
        // For now, let's create a mock video clip with the file info
        const mockClip: VideoClip = {
          id: `clip-${Date.now()}-${i}`,
          path: file.name, // Using name as path for now
          filename: file.name,
          duration: 0, // We'll need to extract this
          thumbnail: '', // We'll generate this
          metadata: {
            width: 1920,
            height: 1080,
            framerate: 30,
            codec: 'h264',
            fileSize: file.size,
          },
          importedAt: new Date(),
        };

        setState(prev => ({
          ...prev,
          clips: [...prev.clips, mockClip],
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
    }));
  }, []);

  const value: VideoImportContextType = {
    clips: state.clips,
    isImporting: state.isImporting,
    importProgress: state.importProgress,
    error: state.error,
    importFiles,
    importFromFiles,
    clearError,
    removeClip,
    clearLibrary,
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
