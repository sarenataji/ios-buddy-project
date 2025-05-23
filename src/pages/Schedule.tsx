import React, { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ScheduleHeader from "@/components/ScheduleHeader";
import TimelineSection from "@/components/TimelineSection";
import EventListSection from "@/components/EventListSection";
import ActionButtons from "@/components/ActionButtons";
import { useSchedule } from "@/contexts/ScheduleContext";
import EventForm from "@/components/EventForm";
import { useToast } from "@/components/ui/use-toast";
import EventCreationHandler from "@/components/moments/EventCreationHandler";
import CompletedEventsList from "@/components/CompletedEventsList";

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const [deleteEventDialogOpen, setDeleteEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editedEvent, setEditedEvent] = useState<any>(null);
  const { events, updateEvent, deleteEvent, getEventsForDate, toggleEventCompletion } = useSchedule();
  const { toast } = useToast();

  const eventsForDate = getEventsForDate(currentDate);
  const completedEvents = eventsForDate.filter(event => event.completed);

  const handlePreviousDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const toggleEventComplete = (eventId: number) => {
    toggleEventCompletion(eventId);
  };

  const openEditEventDialog = (event: any) => {
    setSelectedEvent(event);
    setEditedEvent({ ...event });
    setEditEventDialogOpen(true);
  };

  const closeEditEventDialog = () => {
    setSelectedEvent(null);
    setEditedEvent(null);
    setEditEventDialogOpen(false);
  };

  const openDeleteEventDialog = (event: any) => {
    setSelectedEvent(event);
    setDeleteEventDialogOpen(true);
  };

  const closeDeleteEventDialog = () => {
    setSelectedEvent(null);
    setDeleteEventDialogOpen(false);
  };

  const handleEditEventSubmit = () => {
    if (!editedEvent) return;

    // Validate startTime and endTime
    if (!editedEvent.startTime || !editedEvent.endTime) {
      toast({
        title: "Invalid Time",
        description: "Please provide both start and end times.",
        variant: "destructive",
      });
      return;
    }

    // Parse startTime and endTime
    const [startHours, startMinutes] = editedEvent.startTime.split(':').map(Number);
    const [endHours, endMinutes] = editedEvent.endTime.split(':').map(Number);

    // Create new Date objects for start and end times
    const eventTime = new Date(selectedEvent.time);
    eventTime.setHours(startHours, startMinutes, 0, 0);

    const eventDescription = `${editedEvent.startTime} - ${editedEvent.endTime}`;

    const updatedEventData = {
      ...selectedEvent,
      time: eventTime,
      title: editedEvent.title,
      description: eventDescription,
      person: editedEvent.person,
      location: editedEvent.location,
      color: editedEvent.color,
      icon: editedEvent.icon,
      repeat: editedEvent.repeat,
    };

    updateEvent(updatedEventData);
    closeEditEventDialog();

    toast({
      title: "Event updated",
      description: `${updatedEventData.title} has been updated successfully.`,
    });
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    deleteEvent(selectedEvent.id);
    closeDeleteEventDialog();

    toast({
      title: "Event deleted",
      description: `${selectedEvent.title} has been deleted.`,
    });
  };

  const handleWeekdayToggle = (day: string, isAdd: boolean, isEditing: boolean = false) => {
    setEditedEvent(prevEvent => {
      if (!prevEvent) return prevEvent;

      let updatedDays = [...(prevEvent.repeat?.days || [])];
      if (isAdd) {
        updatedDays.push(day);
      } else {
        updatedDays = updatedDays.filter(d => d !== day);
      }

      return {
        ...prevEvent,
        repeat: {
          ...prevEvent.repeat,
          enabled: true,
          days: updatedDays,
        },
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#2a1f15] text-[#c69c6d] p-4">
      {/* Event creation event handler */}
      <EventCreationHandler />
      
      {/* Schedule Header */}
      <ScheduleHeader 
        currentDate={currentDate}
        onPreviousDay={handlePreviousDay}
        onNextDay={handleNextDay}
        onTodayClick={handleTodayClick}
        completedEventsCount={completedEvents.length}
        totalEventsCount={eventsForDate.length}
      />
      
      {/* Timeline Progress */}
      <div className="mt-6">
        <TimelineSection 
          events={eventsForDate}
          onToggleComplete={toggleEventComplete}
        />
      </div>
      
      {/* Event List */}
      <div className="pb-20">
        <EventListSection 
          events={eventsForDate.filter(event => !event.completed)}
          onToggleComplete={toggleEventComplete}
          onEditEvent={openEditEventDialog}
          onDeleteEvent={openDeleteEventDialog}
        />
      </div>
      
      {/* Completed Events List */}
      {completedEvents.length > 0 && (
        <CompletedEventsList 
          completedEvents={completedEvents}
          onEventEdit={openEditEventDialog}
          onEventDelete={openDeleteEventDialog}
        />
      )}
      
      {/* Add New Event Button */}
      <ActionButtons 
        onAddEvent={() => {
          // This is now handled by the EventCreationHandler
          console.log("Event will be created by the EventCreationHandler");
        }}
        selectedDate={currentDate}
      />
      
      {/* Edit Event Dialog */}
      {editEventDialogOpen && selectedEvent && (
        <Dialog open={editEventDialogOpen} onOpenChange={setEditEventDialogOpen}>
          <DialogContent className="bg-[#2a1f15] border-[#c69c6d33] text-[#c69c6d] max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription className="text-[#c69c6d88]">
                Make changes to your event.
              </DialogDescription>
            </DialogHeader>
            <EventForm
              event={{
                title: selectedEvent.title,
                startTime: format(selectedEvent.time, "HH:mm"),
                endTime: selectedEvent.description.split(' - ')[1],
                person: selectedEvent.person,
                location: selectedEvent.location || '',
                color: selectedEvent.color,
                icon: selectedEvent.icon || '📅',
                repeat: selectedEvent.repeat || { enabled: false, days: [] },
              }}
              isEditing={true}
              onSubmit={handleEditEventSubmit}
              onChange={setEditedEvent}
              onWeekdayToggle={handleWeekdayToggle}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {deleteEventDialogOpen && selectedEvent && (
        <AlertDialog open={deleteEventDialogOpen} onOpenChange={setDeleteEventDialogOpen}>
          <AlertDialogContent className="bg-[#2a1f15] border-[#c69c6d33] text-[#c69c6d]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#c69c6d88]">
                This will permanently delete the event "{selectedEvent.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2a1f15] border-[#c69c6d33] text-[#c69c6d] hover:bg-[#c69c6d22] hover:text-[#c69c6d]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDeleteEvent}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Schedule;
