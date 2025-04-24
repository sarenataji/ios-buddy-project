
import React from "react";
import { format } from "date-fns";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditMomentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editTitle: string;
  setEditTitle: (value: string) => void;
  editDate: string;
  setEditDate: (value: string) => void;
  editTime: string;
  setEditTime: (value: string) => void;
  editLocation: string;
  setEditLocation: (value: string) => void;
  editNote: string;
  setEditNote: (value: string) => void;
  onSave: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
  showDelete: boolean;
}

const EditMomentDialog = ({
  isOpen,
  onClose,
  editTitle,
  setEditTitle,
  editDate,
  setEditDate,
  editTime,
  setEditTime,
  editLocation,
  setEditLocation,
  editNote,
  setEditNote,
  onSave,
  onDelete,
  onComplete,
  showDelete
}: EditMomentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="bg-[#161213] border border-[#e8c28233] text-[#edd6ae]">
        <DialogHeader>
          <DialogTitle className="text-[#edd6ae] text-center text-xl tracking-wide lowercase">Edit Moment</DialogTitle>
          <DialogDescription className="text-center text-[#e8c28288]">
            Make changes to your moment details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-[#e8c282] block mb-2 tracking-wider lowercase">Title</label>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#e8c282] block mb-2 tracking-wider lowercase">Start Date</label>
            <Input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#e8c282] block mb-2 tracking-wider lowercase">Time</label>
            <Input
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#e8c282] block mb-2 tracking-wider lowercase">
              Location <span className="text-[#e8c28277]">(optional)</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-[#e8c28215] border border-r-0 border-[#e8c28233] rounded-l-md">
                <MapPin className="h-4 w-4 text-[#e8c282]" />
              </span>
              <Input
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae] rounded-l-none"
                placeholder="Enter location"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#e8c282] block mb-2 tracking-wider lowercase">
              Memories <span className="text-[#e8c28277]">(optional)</span>
            </label>
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              className="w-full bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae] rounded-md p-3 min-h-[100px]"
              placeholder="Add a memory or note about this moment..."
            />
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {showDelete && (
                <div className="flex gap-3 w-full">
                  {onDelete && (
                    <Button
                      onClick={onDelete}
                      variant="destructive"
                      className="w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                  )}
                  {onComplete && (
                    <Button
                      onClick={onComplete}
                      className="w-full sm:w-auto bg-[#2a7b53] hover:bg-[#35946a] text-[#eddcbe] flex gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete Moment
                    </Button>
                  )}
                </div>
              )}
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full bg-transparent border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28215]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onSave}
                  className="w-full bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMomentDialog;
