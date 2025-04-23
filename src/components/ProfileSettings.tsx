
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ProfileSettingsProps {
  nickname: string;
  quote: string;
  location: string;
  birthdate: Date;
  onUpdate: (data: {
    nickname?: string;
    quote?: string;
    location?: string;
    birthdate?: Date;
  }) => void;
}

const ProfileSettings = ({
  nickname,
  quote,
  location,
  birthdate,
  onUpdate,
}: ProfileSettingsProps) => {
  const [localNickname, setLocalNickname] = React.useState(nickname);
  const [localQuote, setLocalQuote] = React.useState(quote);
  const [localLocation, setLocalLocation] = React.useState(location);
  const [localBirthdate, setLocalBirthdate] = React.useState(
    format(birthdate, "yyyy-MM-dd")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      nickname: localNickname,
      quote: localQuote,
      location: localLocation,
      birthdate: new Date(localBirthdate),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="absolute top-4 right-4 p-2 rounded-full bg-[#1a1f2c]/85 border border-[#e8c28244] hover:bg-[#1a1f2c] transition-colors">
          <Settings className="w-5 h-5 text-[#e8c282]" />
        </button>
      </SheetTrigger>
      <SheetContent className="bg-[#1a1f2c] border-[#e8c28244] text-[#e8c282]">
        <SheetHeader>
          <SheetTitle className="text-[#edd6ae]">Profile Settings</SheetTitle>
          <SheetDescription className="text-[#e8c282cc]">
            Update your profile information here.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e8c282]">Nickname</label>
            <Input
              value={localNickname}
              onChange={(e) => setLocalNickname(e.target.value)}
              className="bg-[#161213] border-[#e8c28244] text-[#edd6ae]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e8c282]">Quote</label>
            <Input
              value={localQuote}
              onChange={(e) => setLocalQuote(e.target.value)}
              className="bg-[#161213] border-[#e8c28244] text-[#edd6ae]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e8c282]">Location</label>
            <Input
              value={localLocation}
              onChange={(e) => setLocalLocation(e.target.value)}
              className="bg-[#161213] border-[#e8c28244] text-[#edd6ae]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e8c282]">Birthdate</label>
            <Input
              type="date"
              value={localBirthdate}
              onChange={(e) => setLocalBirthdate(e.target.value)}
              className="bg-[#161213] border-[#e8c28244] text-[#edd6ae]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
          >
            Save Changes
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSettings;
