
import { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';

interface SavedFace {
  index: number;
  mood: string;
  timestamp: Date;
  date: string; // YYYY-MM-DD format for easy lookup
}

interface DailyReflection {
  date: string;
  faces: SavedFace[];
}

interface FaceContextType {
  savedFaces: SavedFace[];
  currentFace: SavedFace | null;
  saveFace: (index: number, mood: string) => void;
  clearSavedFaces: () => void;
  getReflectionsByDate: (date: Date) => SavedFace[];
  getReflectionsByMonth: (month: number, year: number) => DailyReflection[];
  getLastReflectionForDate: (date: Date) => SavedFace | null;
}

const FaceContext = createContext<FaceContextType | undefined>(undefined);

export function FaceProvider({ children }: { children: ReactNode }) {
  const [savedFaces, setSavedFaces] = useState<SavedFace[]>([]);
  const [currentFace, setCurrentFace] = useState<SavedFace | null>(null);
  
  const saveFace = (index: number, mood: string) => {
    const now = new Date();
    const dateStr = format(now, 'yyyy-MM-dd');
    
    const newFace: SavedFace = {
      index,
      mood,
      timestamp: now,
      date: dateStr,
    };
    
    setSavedFaces(prev => [...prev, newFace]);
    setCurrentFace(newFace);
  };
  
  const clearSavedFaces = () => {
    setSavedFaces([]);
    setCurrentFace(null);
  };

  const getReflectionsByDate = (date: Date): SavedFace[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return savedFaces.filter(face => face.date === dateStr);
  };

  const getReflectionsByMonth = (month: number, year: number): DailyReflection[] => {
    const monthStr = month < 9 ? `0${month + 1}` : `${month + 1}`;
    const monthPrefix = `${year}-${monthStr}`;
    
    // Group by date
    const reflectionsByDate: Record<string, SavedFace[]> = {};
    
    savedFaces.forEach(face => {
      if (face.date.startsWith(monthPrefix)) {
        if (!reflectionsByDate[face.date]) {
          reflectionsByDate[face.date] = [];
        }
        reflectionsByDate[face.date].push(face);
      }
    });
    
    // Convert to array
    return Object.keys(reflectionsByDate).map(date => ({
      date,
      faces: reflectionsByDate[date],
    }));
  };

  const getLastReflectionForDate = (date: Date): SavedFace | null => {
    const reflections = getReflectionsByDate(date);
    if (reflections.length === 0) return null;
    
    // Sort by timestamp (newest first) and return the first one
    return [...reflections].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    )[0];
  };
  
  return (
    <FaceContext.Provider value={{
      savedFaces,
      currentFace,
      saveFace,
      clearSavedFaces,
      getReflectionsByDate,
      getReflectionsByMonth,
      getLastReflectionForDate,
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
