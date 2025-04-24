
import React, { createContext, useContext, useState, useEffect } from "react";

interface Moment {
  id: number;
  title: string;
  startDate: Date;
  location?: string;
  description?: string;
  note?: string;
  isPredefined?: boolean;
  order?: number;
  stoppedAt?: Date;
  isActive?: boolean;
}

interface MomentContextType {
  moments: Moment[];
  addMoment: (moment: Omit<Moment, "id">) => void;
  deleteMoment: (id: number) => void;
  updateMoment: (moment: Moment) => void;
  reorderMoments: (moments: Moment[]) => void;
  stopMoment: (id: number) => void;
}

const predefinedMoments: Omit<Moment, "id">[] = [
  {
    title: "Hair",
    startDate: new Date(2024, 3, 8), // April 8, 2024
    isPredefined: true
  },
  {
    title: "Türkiye",
    startDate: new Date(2023, 8, 15), // September 15, 2023
    isPredefined: true
  },
  {
    title: "Europe",
    startDate: new Date(2023, 5, 1), // June 1, 2023
    isPredefined: true
  },
  {
    title: "Abroad",
    startDate: new Date(2023, 0, 1), // January 1, 2023
    isPredefined: true
  },
  {
    title: "S. Birth",
    startDate: new Date(2000, 3, 15), // April 15, 2000
    isPredefined: true
  },
  {
    title: "L. Birth",
    startDate: new Date(1998, 0, 1), // January 1, 1998
    isPredefined: true
  }
];

const MomentContext = createContext<MomentContextType | undefined>(undefined);

export const useMoment = () => {
  const context = useContext(MomentContext);
  if (!context) throw new Error("useMoment must be used within MomentProvider");
  return context;
};

export const MomentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moments, setMoments] = useState<Moment[]>(() => {
    try {
      const saved = localStorage.getItem("moments");
      if (saved) {
        // Properly parse dates when retrieving from localStorage
        const parsedMoments = JSON.parse(saved, (key, value) => {
          if (key === "startDate" || key === "stoppedAt") {
            return value ? new Date(value) : null;
          }
          return value;
        });
        
        // Make sure isActive is properly preserved
        parsedMoments.forEach((moment: Moment) => {
          moment.startDate = new Date(moment.startDate);
          if (moment.stoppedAt) {
            moment.stoppedAt = new Date(moment.stoppedAt);
            moment.isActive = false;
          }
        });
        
        const predefinedIds = predefinedMoments.map(m => m.title);
        const filteredSaved = parsedMoments.filter((m: Moment) => !predefinedIds.includes(m.title));
        const orderedMoments = [...predefinedMoments.map((m, i) => ({ 
          ...m, 
          id: -1 - i, 
          order: i,
          isActive: true 
        })), 
          ...filteredSaved.map((m: Moment, i: number) => ({ 
            ...m, 
            order: predefinedMoments.length + i,
            isActive: m.stoppedAt ? false : (m.isActive !== undefined ? m.isActive : true)
          }))];
        return orderedMoments;
      }
    } catch (error) {
      console.error("Error loading moments from localStorage:", error);
    }
    return predefinedMoments.map((m, i) => ({ ...m, id: -1 - i, order: i, isActive: true }));
  });

  useEffect(() => {
    try {
      localStorage.setItem("moments", JSON.stringify(moments));
    } catch (error) {
      console.error("Error saving moments to localStorage:", error);
    }
  }, [moments]);

  const addMoment = (moment: Omit<Moment, "id">) => {
    setMoments(prev => [...prev, { ...moment, id: Date.now(), order: prev.length }]);
  };

  const deleteMoment = (id: number) => {
    setMoments(prev => {
      const filtered = prev.filter(m => m.id !== id);
      return filtered.map((m, i) => ({ ...m, order: i }));
    });
  };

  const updateMoment = (moment: Moment) => {
    setMoments(prev => prev.map(m => m.id === moment.id ? moment : m));
  };

  const reorderMoments = (reorderedMoments: Moment[]) => {
    setMoments(reorderedMoments.map((m, i) => ({ ...m, order: i })));
  };

  const stopMoment = (id: number) => {
    setMoments(prev => prev.map(m => 
      m.id === id 
        ? { ...m, isActive: false, stoppedAt: new Date() }
        : m
    ));
  };

  return (
    <MomentContext.Provider value={{ 
      moments, 
      addMoment, 
      deleteMoment, 
      updateMoment, 
      reorderMoments,
      stopMoment 
    }}>
      {children}
    </MomentContext.Provider>
  );
};
