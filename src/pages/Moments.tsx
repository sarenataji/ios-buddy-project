import { useState } from "react";
import { useMoment } from "@/contexts/MomentContext";
import { useCountdown } from "@/hooks/useCountdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { MomentsSection } from "@/components/MomentsSection";
import MomentsHeader from "@/components/MomentsHeader";
import NewMomentForm from "@/components/NewMomentForm";
import NewCountdownForm from "@/components/NewCountdownForm";

const Moments = () => {
  const { addMoment } = useMoment();
  const { addCountdown } = useCountdown();
  const [isAddingMoment, setIsAddingMoment] = useState(false);
  const [isAddingCountdown, setIsAddingCountdown] = useState(false);
  const { toast } = useToast();

  const handleAddMoment = (data: {
    title: string;
    startDate: Date;
    location?: string;
    note?: string;
  }) => {
    addMoment(data);
    setIsAddingMoment(false);
    
    toast({
      title: "Moment added",
      description: "Your new moment has been created",
    });
  };

  const handleAddCountdown = (data: {
    title: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    note?: string;
  }) => {
    addCountdown(data);
    setIsAddingCountdown(false);
    
    toast({
      title: "Countdown added",
      description: "Your new countdown has been created",
    });
  };

  return (
    <div className="min-h-screen bg-[#140D07] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <MomentsHeader />
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setIsAddingMoment(true)}
            className="
              bg-[#e8c282] text-[#1a1f2c]
              hover:bg-[#edd6ae] transition-all duration-300
              px-6 py-2 rounded-xl
              flex items-center gap-2
              shadow-[0_0_15px_0_#e8c28233]
              hover:shadow-[0_0_25px_0_#e8c28266]
              font-medium
            "
          >
            <span className="text-lg">+</span>
            <span>Add Moment</span>
          </button>

          <button
            onClick={() => setIsAddingCountdown(true)}
            className="
              bg-[#7e5a39] text-[#edd6ae]
              hover:bg-[#7e5a39]/80 transition-all duration-300
              px-6 py-2 rounded-xl
              flex items-center gap-2
              shadow-[0_0_15px_0_#e8c28233]
              hover:shadow-[0_0_25px_0_#e8c28266]
              font-medium
            "
          >
            <span className="text-lg">+</span>
            <span>Add Countdown</span>
          </button>
        </div>
        
        <MomentsSection />

        <Sheet open={isAddingMoment} onOpenChange={setIsAddingMoment}>
          <SheetContent className="bg-[#1a0c05] border-l border-[#e8c28233] text-[#edd6ae]">
            <SheetHeader>
              <SheetTitle className="text-[#edd6ae] text-center text-xl tracking-wide lowercase">New Moment</SheetTitle>
            </SheetHeader>
            <NewMomentForm onSubmit={handleAddMoment} />
          </SheetContent>
        </Sheet>

        <Sheet open={isAddingCountdown} onOpenChange={setIsAddingCountdown}>
          <SheetContent className="bg-[#1a0c05] border-l border-[#e8c28233] text-[#edd6ae]">
            <SheetHeader>
              <SheetTitle className="text-[#edd6ae] text-center text-xl tracking-wide lowercase">New Countdown</SheetTitle>
            </SheetHeader>
            <NewCountdownForm onSubmit={handleAddCountdown} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Moments;
