
import React, { useState, useRef, useEffect } from "react";
import { Plus, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ActionButtonsProps {
  onAddEvent: () => void;
}

const ActionButtons = ({ onAddEvent }: ActionButtonsProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Function to clear timer and reset state
  const resetState = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    touchStartYRef.current = null;
    setIsHolding(false);
    setSlidePosition(0);
  };

  // Handle start of touch/press
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // Start a timer to detect holding (500ms)
    holdTimerRef.current = setTimeout(() => {
      setIsHolding(true);
      // Get the Y position
      if ('touches' in e) {
        touchStartYRef.current = e.touches[0].clientY;
      } else {
        touchStartYRef.current = e.clientY;
      }
      
      // Show guidance toast
      toast({
        title: "Slide up for Time Capsule",
        description: "Slide up while holding to navigate to moments",
        duration: 2000,
      });
      
    }, 500);
    
    // Prevent default to avoid click event
    e.preventDefault();
  };

  // Handle movement during touch/press
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (isHolding && touchStartYRef.current !== null) {
      let currentY;
      if ('touches' in e) {
        currentY = e.touches[0].clientY;
      } else {
        currentY = e.clientY;
      }
      
      // Calculate how much the user has slid (negative = sliding up)
      const deltaY = currentY - touchStartYRef.current;
      
      // Only activate for upward movement
      if (deltaY < 0) {
        // Set slide position (0 to 100, capped)
        const newPosition = Math.min(100, Math.abs(deltaY) / 2);
        setSlidePosition(newPosition);
        
        // If slid more than 70% of the way, navigate
        if (newPosition > 70) {
          resetState();
          navigate('/moments');
        }
      }
    }
  };

  // Handle end of touch/press
  const handleTouchEnd = () => {
    resetState();
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <div 
        className={`absolute bottom-full mb-4 transition-transform duration-300 ${
          isHolding ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          transform: `translateY(-${slidePosition}px)`,
          pointerEvents: isHolding ? "auto" : "none"
        }}
      >
        <div className="bg-[#1a1f2c] border border-[#e8c28233] text-[#e8c282] rounded-full py-1 px-3 flex items-center gap-1 shadow-lg">
          <ArrowUp size={14} />
          <span className="text-xs font-medium">Moments</span>
        </div>
      </div>
      
      <Button
        ref={buttonRef}
        size="icon"
        onClick={!isHolding ? onAddEvent : undefined}
        className={`h-14 w-14 rounded-full bg-[#e8c282] hover:bg-[#edd6ae] text-[#1a1f2c] shadow-lg transition-transform ${
          isHolding ? "scale-110" : ""
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <Plus size={24} />
      </Button>
    </div>
  );
};

export default ActionButtons;
