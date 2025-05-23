
import { useState } from "react";
import { useMoment } from "@/contexts/MomentContext";
import { useCountdown } from "@/hooks/useCountdown";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { MomentsSection } from "@/components/MomentsSection";
import MomentsHeader from "@/components/MomentsHeader";
import StepByStepMomentForm from "@/components/moments/StepByStepMomentForm";
import StepByStepCountdownForm from "@/components/moments/StepByStepCountdownForm";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock } from "lucide-react";

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
          <motion.button
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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="text-lg" />
            <span>Add Moment</span>
          </motion.button>

          <motion.button
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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Clock className="text-lg" />
            <span>Add Countdown</span>
          </motion.button>
        </div>
        
        <MomentsSection />

        {/* Moment Form Drawer */}
        <Drawer open={isAddingMoment} onOpenChange={setIsAddingMoment}>
          <DrawerContent className="max-w-[90%] w-[500px] mx-auto rounded-t-xl bg-[#1a0c05] border border-[#e8c28233] text-[#edd6ae] p-4">
            <div className="mx-auto h-1 w-12 rounded-full bg-[#e8c28233] mb-3" />
            <DrawerHeader className="p-0">
              <DrawerTitle className="text-[#edd6ae] text-center text-2xl tracking-wide font-light">
                <span className="mr-2">✨</span> New Moment <span className="ml-2">✨</span>
              </DrawerTitle>
            </DrawerHeader>
            <div className="mt-6 px-2">
              <StepByStepMomentForm 
                onSubmit={handleAddMoment} 
                onCancel={() => setIsAddingMoment(false)} 
              />
            </div>
          </DrawerContent>
        </Drawer>

        {/* Countdown Form Drawer */}
        <Drawer open={isAddingCountdown} onOpenChange={setIsAddingCountdown}>
          <DrawerContent className="max-w-[90%] w-[500px] mx-auto rounded-t-xl bg-[#1a0c05] border border-[#e8c28233] text-[#edd6ae] p-4">
            <div className="mx-auto h-1 w-12 rounded-full bg-[#e8c28233] mb-3" />
            <DrawerHeader className="p-0">
              <DrawerTitle className="text-[#edd6ae] text-center text-2xl tracking-wide font-light">
                <span className="mr-2">⏱️</span> New Countdown <span className="ml-2">⏱️</span>
              </DrawerTitle>
            </DrawerHeader>
            <div className="mt-6 px-2">
              <StepByStepCountdownForm 
                onSubmit={handleAddCountdown} 
                onCancel={() => setIsAddingCountdown(false)} 
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Moments;
