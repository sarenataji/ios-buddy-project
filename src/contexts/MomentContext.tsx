
import React, { createContext, useContext, useState, useEffect } from "react";

interface Moment {
  id: number;
  title: string;
  startDate: Date;
  description?: string;
}

interface MomentContextType {
  moments: Moment[];
  addMoment: (moment: Omit<Moment, "id">) => void;
  deleteMoment: (id: number) => void;
  updateMoment: (moment: Moment) => void;
}

const MomentContext = createContext<MomentContextType | undefined>(undefined);

export const useMoment = () => {
  const context = useContext(MomentContext);
  if (!context) throw new Error("useMoment must be used within MomentProvider");
  return context;
};

export const MomentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moments, setMoments] = useState<Moment[]>(() => {
    const saved = localStorage.getItem("moments");
    if (saved) {
      return JSON.parse(saved, (key, value) => {
        if (key === "startDate") return new Date(value);
        return value;
      });
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("moments", JSON.stringify(moments));
  }, [moments]);

  const addMoment = (moment: Omit<Moment, "id">) => {
    setMoments(prev => [...prev, { ...moment, id: Date.now() }]);
  };

  const deleteMoment = (id: number) => {
    setMoments(prev => prev.filter(m => m.id !== id));
  };

  const updateMoment = (moment: Moment) => {
    setMoments(prev => prev.map(m => m.id === moment.id ? moment : m));
  };

  return (
    <MomentContext.Provider value={{ moments, addMoment, deleteMoment, updateMoment }}>
      {children}
    </MomentContext.Provider>
  );
};
