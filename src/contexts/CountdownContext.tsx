
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
    console.log("Adding countdown:", countdown);
    // Ensure dates are Date objects
    const newCountdown = {
      ...countdown,
      id: Date.now(),
      isCompleted: false,
      startDate: countdown.startDate instanceof Date ? countdown.startDate : new Date(countdown.startDate),
      endDate: countdown.endDate instanceof Date ? countdown.endDate : new Date(countdown.endDate)
    };
    
    setCountdowns(prev => [...prev, newCountdown]);
  };

  const deleteCountdown = (id: number) => {
    setCountdowns(prev => prev.filter(c => c.id !== id));
  };

  const updateCountdown = (countdown: Countdown) => {
    // Ensure dates are Date objects
    const updatedCountdown = {
      ...countdown,
      startDate: countdown.startDate instanceof Date ? countdown.startDate : new Date(countdown.startDate),
      endDate: countdown.endDate instanceof Date ? countdown.endDate : new Date(countdown.endDate)
    };
    
    setCountdowns(prev => prev.map(c => c.id === countdown.id ? updatedCountdown : c));
  };

  const completeCountdown = (id: number) => {
    console.log("Completing countdown:", id);
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
