
import { createContext, useContext, useState, ReactNode } from 'react';

interface SavedFace {
  index: number;
  mood: string;
  timestamp: Date;
}

interface FaceContextType {
  savedFaces: SavedFace[];
  currentFace: SavedFace | null;
  saveFace: (index: number, mood: string) => void;
  clearSavedFaces: () => void;
}

const FaceContext = createContext<FaceContextType | undefined>(undefined);

export function FaceProvider({ children }: { children: ReactNode }) {
  const [savedFaces, setSavedFaces] = useState<SavedFace[]>([]);
  const [currentFace, setCurrentFace] = useState<SavedFace | null>(null);
  
  const saveFace = (index: number, mood: string) => {
    const newFace: SavedFace = {
      index,
      mood,
      timestamp: new Date(),
    };
    
    setSavedFaces(prev => [...prev, newFace]);
    setCurrentFace(newFace);
  };
  
  const clearSavedFaces = () => {
    setSavedFaces([]);
    setCurrentFace(null);
  };
  
  return (
    <FaceContext.Provider value={{
      savedFaces,
      currentFace,
      saveFace,
      clearSavedFaces,
    }}>
      {children}
    </FaceContext.Provider>
  );
}

export const useFace = (): FaceContextType => {
  const context = useContext(FaceContext);
  if (context === undefined) {
    throw new Error('useFace must be used within a FaceProvider');
  }
  return context;
};
