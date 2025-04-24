import React, { createContext, useContext, useState, useEffect } from "react";

interface Moment {
  id: number;
  title: string;
  startDate: Date;
  location?: string;
  description?: string;
  note?: string;
  isPredefined?: boolean;
}

interface MomentContextType {
  moments: Moment[];
  addMoment: (moment: Omit<Moment, "id">) => void;
  deleteMoment: (id: number) => void;
  updateMoment: (moment: Moment) => void;
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
    const saved = localStorage.getItem("moments");
    if (saved) {
      const parsedMoments = JSON.parse(saved, (key, value) => {
        if (key === "startDate") return new Date(value);
        return value;
      });
      const predefinedIds = predefinedMoments.map(m => m.title);
      const filteredSaved = parsedMoments.filter((m: Moment) => !predefinedIds.includes(m.title));
      return [...predefinedMoments.map((m, i) => ({ ...m, id: -1 - i })), ...filteredSaved];
    }
    return predefinedMoments.map((m, i) => ({ ...m, id: -1 - i }));
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
