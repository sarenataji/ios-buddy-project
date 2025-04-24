
import { useContext } from "react";
import { CountdownContext } from "../contexts/CountdownContext";

export const useCountdown = () => {
  const context = useContext(CountdownContext);
  if (!context) {
    throw new Error("useCountdown must be used within a CountdownProvider");
  }
  return context;
};
