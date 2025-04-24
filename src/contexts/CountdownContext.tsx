
import React, { createContext, useState, useEffect } from "react";

interface Countdown {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
  note?: string;
  isCompleted?: boolean;
}

interface CountdownContextType {
  countdowns: Countdown[];
  addCountdown: (countdown: Omit<Countdown, "id" | "isCompleted">) => void;
  deleteCountdown: (id: number) => void;
  updateCountdown: (countdown: Countdown) => void;
  completeCountdown: (id: number) => void;
}

export const CountdownContext = createContext<CountdownContextType | undefined>(undefined);

export const CountdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countdowns, setCountdowns] = useState<Countdown[]>(() => {
    try {
      const saved = localStorage.getItem("countdowns");
      if (saved) {
        return JSON.parse(saved, (key, value) => {
          if (key === "startDate" || key === "endDate") {
            return new Date(value);
          }
          return value;
        });
      }
    } catch (error) {
      console.error("Error loading countdowns from localStorage:", error);
    }
    return [];
  });

  useEffect(() => {
    const serializedCountdowns = JSON.stringify(countdowns, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
    localStorage.setItem("countdowns", serializedCountdowns);
  }, [countdowns]);

  const addCountdown = (countdown: Omit<Countdown, "id" | "isCompleted">) => {
    setCountdowns(prev => [...prev, { ...countdown, id: Date.now(), isCompleted: false }]);
  };

  const deleteCountdown = (id: number) => {
    setCountdowns(prev => prev.filter(c => c.id !== id));
  };

  const updateCountdown = (countdown: Countdown) => {
    setCountdowns(prev => prev.map(c => c.id === countdown.id ? countdown : c));
  };

  const completeCountdown = (id: number) => {
    setCountdowns(prev => prev.map(c => 
      c.id === id ? { ...c, isCompleted: true } : c
    ));
  };

  return (
    <CountdownContext.Provider value={{ 
      countdowns, 
      addCountdown, 
      deleteCountdown, 
      updateCountdown,
      completeCountdown
    }}>
      {children}
    </CountdownContext.Provider>
  );
};
