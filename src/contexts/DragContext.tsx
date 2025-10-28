import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VideoClip } from '../types/AppState';

interface DragState {
  isDragging: boolean;
  draggedClip: VideoClip | null;
}

interface DragContextType {
  dragState: DragState;
  startDrag: (clip: VideoClip) => void;
  endDrag: () => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

interface DragProviderProps {
  children: ReactNode;
}

export const DragProvider = ({ children }: DragProviderProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedClip: null,
  });

  // Auto-cleanup drag state after 10 seconds to prevent stuck states
  useEffect(() => {
    if (dragState.isDragging) {
      const timeout = setTimeout(() => {
        console.log('🧹 Auto-cleaning up drag state after timeout');
        setDragState({
          isDragging: false,
          draggedClip: null,
        });
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [dragState.isDragging]);

  const startDrag = (clip: VideoClip) => {
    console.log('🚀 DragContext: Starting drag for clip:', clip.filename);
    setDragState({
      isDragging: true,
      draggedClip: clip,
    });
  };

  const endDrag = () => {
    console.log('🏁 DragContext: Ending drag');
    setDragState({
      isDragging: false,
      draggedClip: null,
    });
  };

  const value: DragContextType = {
    dragState,
    startDrag,
    endDrag,
  };

  return (
    <DragContext.Provider value={value}>
      {children}
    </DragContext.Provider>
  );
};

export const useDrag = () => {
  const context = useContext(DragContext);
  if (context === undefined) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
};
