
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddMomentButtonProps {
  onClick: () => void;
}

const AddMomentButton = ({ onClick }: AddMomentButtonProps) => {
  return (
    <div className="flex justify-center mb-12">
      <Button
        onClick={onClick}
        className="
          bg-[#c69c6d] text-[#2a1f15]
          hover:bg-[#a67c50] transition-all duration-300
          px-6 py-2 rounded-xl
          flex items-center gap-2
          shadow-[0_0_15px_0_#c69c6d33]
          hover:shadow-[0_0_25px_0_#c69c6d66]
          font-medium
        "
      >
        <Plus className="h-5 w-5" />
        <span>Add Moment</span>
      </Button>
    </div>
  );
};

export default AddMomentButton;
