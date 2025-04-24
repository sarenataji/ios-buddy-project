import React, { useState } from "react";
import { useMoment } from "@/contexts/MomentContext";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import MomentItem from "./moments/MomentItem";
import EditMomentDialog from "./moments/EditMomentDialog";
import StoppedMomentsList from "./moments/StoppedMomentsList";
import CountdownList from "./CountdownList";

export const MomentsSection = () => {
  const { moments, updateMoment, deleteMoment, reorderMoments, stopMoment } = useMoment();
  const [editingMoment, setEditingMoment] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editNote, setEditNote] = useState("");
  const [draggedMoment, setDraggedMoment] = useState<number | null>(null);
  const { toast } = useToast();

  const activeMoments = moments.filter(m => m.isActive !== false);
  const stoppedMoments = moments.filter(m => m.isActive === false);
  const sortedActiveMoments = [...activeMoments].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleEdit = (id: number) => {
    const moment = moments.find(m => m.id === id);
    if (moment) {
      setEditingMoment(id);
      setEditTitle(moment.title);
      setEditDate(format(moment.startDate, "yyyy-MM-dd"));
      setEditTime(format(moment.startDate, "HH:mm"));
      setEditLocation(moment.location || "");
      setEditNote(moment.note || "");
    }
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your moment",
        variant: "destructive",
      });
      return;
    }

    const momentToUpdate = moments.find(m => m.id === editingMoment);
    if (momentToUpdate) {
      const [year, month, day] = editDate.split('-').map(Number);
      const [hours, minutes] = editTime ? editTime.split(':').map(Number) : [0, 0];
      
      const updatedDate = new Date(year, month - 1, day, hours, minutes);
      
      updateMoment({
        ...momentToUpdate,
        title: editTitle,
        startDate: updatedDate,
        location: editLocation.trim() || undefined,
        note: editNote.trim() || undefined,
      });
      
      toast({
        title: "Moment updated",
        description: "Your moment has been updated successfully",
      });
    }

    setEditingMoment(null);
  };

  const handleCancel = () => {
    setEditingMoment(null);
  };

  const handleDeleteMoment = () => {
    if (editingMoment !== null) {
      deleteMoment(editingMoment);
      setEditingMoment(null);
      toast({
        title: "Moment deleted",
        description: "Your moment has been removed",
      });
    }
  };
  
  const handleCompleteMoment = () => {
    if (editingMoment !== null) {
      stopMoment(editingMoment);
      setEditingMoment(null);
      toast({
        title: "Moment completed",
        description: "Your moment has been completed and moved to the completed list",
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    if (moments.find(m => m.id === id)?.isPredefined) {
      e.preventDefault();
      return;
    }
    setDraggedMoment(id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedMoment(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    
    if (moments.find(m => m.id === targetId)?.isPredefined) {
      return;
    }

    if (draggedMoment === null) return;
    
    const reorderedMoments = [...moments];
    const draggedIndex = reorderedMoments.findIndex(m => m.id === draggedMoment);
    const targetIndex = reorderedMoments.findIndex(m => m.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const [draggedItem] = reorderedMoments.splice(draggedIndex, 1);
    reorderedMoments.splice(targetIndex, 0, draggedItem);
    
    reorderMoments(reorderedMoments.map((moment, index) => ({
      ...moment,
      order: index
    })));
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h2 className="text-[#e8c282] tracking-[0.25em] font-serif uppercase text-sm font-semibold mb-6">
          Active Moments
        </h2>
        {sortedActiveMoments.map((moment) => (
          <MomentItem
            key={moment.id}
            id={moment.id}
            title={moment.title}
            startDate={moment.startDate}
            location={moment.location}
            description={moment.description}
            note={moment.note}
            isPredefined={moment.isPredefined}
            onEdit={handleEdit}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>

      <CountdownList />

      {stoppedMoments.length > 0 && (
        <StoppedMomentsList moments={stoppedMoments} />
      )}

      <EditMomentDialog
        isOpen={editingMoment !== null}
        onClose={handleCancel}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDate={editDate}
        setEditDate={setEditDate}
        editTime={editTime}
        setEditTime={setEditTime}
        editLocation={editLocation}
        setEditLocation={setEditLocation}
        editNote={editNote}
        setEditNote={setEditNote}
        onSave={handleSave}
        onDelete={handleDeleteMoment}
        onComplete={handleCompleteMoment}
        showDelete={editingMoment !== null && moments.find(m => m.id === editingMoment)?.isPredefined !== true}
      />
    </div>
  );
};
