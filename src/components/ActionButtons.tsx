
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onAddEvent: () => void;
}

const ActionButtons = ({ onAddEvent }: ActionButtonsProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Button
        size="icon"
        onClick={onAddEvent}
        className="h-14 w-14 rounded-full bg-[#e8c282] hover:bg-[#edd6ae] text-[#1a1f2c] shadow-lg"
      >
        <Plus size={24} />
      </Button>
    </div>
  );
};

export default ActionButtons;
