
import { useState } from "react";
import { useMoment } from "@/contexts/MomentContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { MomentsSection } from "@/components/MomentsSection";
import MomentsHeader from "@/components/MomentsHeader";
import AddMomentButton from "@/components/AddMomentButton";
import NewMomentForm from "@/components/NewMomentForm";

const Moments = () => {
  const { addMoment } = useMoment();
  const [isAddingMoment, setIsAddingMoment] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#140D07] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <MomentsHeader />
        <AddMomentButton onClick={() => setIsAddingMoment(true)} />
        <MomentsSection />

        <Sheet open={isAddingMoment} onOpenChange={setIsAddingMoment}>
          <SheetContent className="bg-[#1a0c05] border-l border-[#e8c28233] text-[#edd6ae]">
            <SheetHeader>
              <SheetTitle className="text-[#edd6ae] text-center text-xl tracking-wide lowercase">New Moment</SheetTitle>
            </SheetHeader>
            <NewMomentForm onSubmit={handleAddMoment} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Moments;
