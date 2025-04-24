
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ThreeCube from "../three/ThreeCube";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MomentsSection } from "@/components/MomentsSection";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import NewMomentForm from "@/components/NewMomentForm";
import { useState } from "react";
import { useMoment } from "@/hooks/useMoment";
import { useToast } from "@/hooks/useToast";
import NewCountdownForm from "@/components/NewCountdownForm";
import { useCountdown } from "@/hooks/useCountdown";

const Index = () => {
  const [isAddingMoment, setIsAddingMoment] = useState(false);
  const [isAddingCountdown, setIsAddingCountdown] = useState(false);
  const { addMoment } = useMoment();
  const { addCountdown } = useCountdown();
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background py-12">
      <div className="w-full max-w-xl px-4 flex flex-col items-center">
        <Card className="w-full mb-8 bg-card/90 shadow-xl border-none">
          <CardContent className="flex flex-col items-center py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary-foreground">
              Moment
            </h1>
            <p className="text-lg md:text-xl text-card-foreground mb-6 text-center">
              Stay hyper-aware of your time.<br />
              <span className="text-primary">Organize</span>, <span className="text-primary">see the countdown</span>, and <span className="text-primary">reflect</span> — all in one elegant flow.
            </p>
            <div className="mt-4 w-full h-60 rounded-2xl overflow-hidden bg-accent/80 flex items-center justify-center border border-accent shadow-glass backdrop-blur-md">
              <Suspense fallback={<div className="text-muted-foreground">Loading 3D...</div>}>
                <ThreeCube />
              </Suspense>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-8 w-full">
              <Button 
                asChild
                className="flex-1 h-12 bg-[#1a1f2c] border border-[#e8c28233] hover:bg-[#1a1f2c]/80 text-[#edd6ae]"
              >
                <Link to="/schedule" className="flex items-center justify-center gap-2">
                  <Calendar size={20} />
                  <span>Schedule</span>
                </Link>
              </Button>
              
              <Button
                asChild
                className="flex-1 h-12 bg-[#e8c282]/20 hover:bg-[#e8c282]/30 text-[#e8c282] border border-[#e8c28244]"
              >
                <Link to="/moments" className="flex items-center justify-center">
                  <span>Moments</span>
                </Link>
              </Button>
              
              <Button
                asChild
                className="flex-1 h-12 bg-[#e8c282]/20 hover:bg-[#e8c282]/30 text-[#e8c282] border border-[#e8c28244]"
              >
                <Link to="/reflection" className="flex items-center justify-center">
                  <span>Reflection</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full mt-8 bg-card/90 shadow-xl border-none">
          <CardContent className="py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary-foreground">Time Tracking</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddingMoment(true)}
                  className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
                >
                  Add Moment
                </Button>
                <Button
                  onClick={() => setIsAddingCountdown(true)}
                  className="bg-[#7e5a39] text-[#edd6ae] hover:bg-[#7e5a39]/80"
                >
                  Add Countdown
                </Button>
              </div>
            </div>
            <MomentsSection />
          </CardContent>
        </Card>
        
        <div className="text-[#e8c282aa] text-center text-sm mb-8 max-w-md">
          <p className="mb-2">
            Track your time with precision and meaning. Schedule your events, follow real-time countdowns, and manage your moments.
          </p>
          <p>
            Designed for elegance, simplicity, and mindful organization.
          </p>
        </div>
        
        <Sheet open={isAddingMoment} onOpenChange={setIsAddingMoment}>
          <SheetContent className="bg-[#1a0c05] border-l border-[#e8c28233] text-[#edd6ae]">
            <SheetHeader>
              <SheetTitle className="text-[#edd6ae] text-center text-xl tracking-wide lowercase">new moment</SheetTitle>
            </SheetHeader>
            <NewMomentForm onSubmit={handleAddMoment} />
          </SheetContent>
        </Sheet>

        <Sheet open={isAddingCountdown} onOpenChange={setIsAddingCountdown}>
          <SheetContent className="bg-[#1a0c05] border-l border-[#e8c28233] text-[#edd6ae]">
            <SheetHeader>
              <SheetTitle className="text-[#edd6ae] text-center text-xl tracking-wide lowercase">new countdown</SheetTitle>
            </SheetHeader>
            <NewCountdownForm onSubmit={handleAddCountdown} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Index;
