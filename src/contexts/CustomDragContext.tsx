import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { VideoClip } from '../types/video';

interface DragPosition {
  x: number;
  y: number;
}

interface CustomDragState {
  isDragging: boolean;
  draggedClip: VideoClip | null;
  dragPosition: DragPosition | null;
  dragStartPosition: DragPosition | null;
}

interface CustomDragContextType {
  dragState: CustomDragState;
  startDrag: (clip: VideoClip, startPos: DragPosition) => void;
  updateDragPosition: (pos: DragPosition) => void;
  endDrag: () => void;
  cancelDrag: () => void;
}

const CustomDragContext = createContext<CustomDragContextType | undefined>(undefined);

export const CustomDragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dragState, setDragState] = useState<CustomDragState>({
    isDragging: false,
    draggedClip: null,
    dragPosition: null,
    dragStartPosition: null,
  });

  const dragThreshold = useRef(5); // pixels to move before starting drag

  const startDrag = useCallback((clip: VideoClip, startPos: DragPosition) => {
    setDragState({
      isDragging: true,
      draggedClip: clip,
      dragPosition: startPos,
      dragStartPosition: startPos,
    });
  }, []);

  const updateDragPosition = useCallback((pos: DragPosition) => {
    setDragState(prev => {
      if (!prev.isDragging) return prev;
      return {
        ...prev,
        dragPosition: pos,
      };
    });
  }, []);

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedClip: null,
      dragPosition: null,
      dragStartPosition: null,
    });
  }, []);

  const cancelDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedClip: null,
      dragPosition: null,
      dragStartPosition: null,
    });
  }, []);

  // Global mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging) {
        updateDragPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (dragState.isDragging) {
        // Don't end drag here - let the drop target handle it
        // If no drop target catches it, we'll cancel it
        const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
        if (!dropTarget?.closest('.timeline-panel-content')) {
          cancelDrag();
        }
      }
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, updateDragPosition, cancelDrag]);

  return (
    <CustomDragContext.Provider value={{ dragState, startDrag, updateDragPosition, endDrag, cancelDrag }}>
      {children}
      {/* Custom drag preview */}
      {dragState.isDragging && dragState.draggedClip && dragState.dragPosition && (
        <div
          style={{
            position: 'fixed',
            left: dragState.dragPosition.x,
            top: dragState.dragPosition.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10000,
            backgroundColor: 'rgba(33, 150, 243, 0.9)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            fontWeight: 600,
            fontSize: '14px',
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          📹 {dragState.draggedClip.filename}
        </div>
      )}
    </CustomDragContext.Provider>
  );
};

export const useCustomDrag = (): CustomDragContextType => {
  const context = useContext(CustomDragContext);
  if (!context) {
    throw new Error('useCustomDrag must be used within CustomDragProvider');
  }
  return context;
};

