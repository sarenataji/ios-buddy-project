
import React from 'react';
import { useFace } from '@/hooks/useFace';
import { format } from 'date-fns';

const SavedFacesHistory = () => {
  const { savedFaces } = useFace();
  
  if (savedFaces.length === 0) {
    return (
      <div className="w-full py-8 text-center text-[#edd6ae]/60">
        <p className="italic font-serif">No face reflections saved yet</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <h3 className="text-[#e8c282] font-serif text-xl mb-4">Saved Reflections</h3>
      
      <div className="space-y-3">
        {savedFaces.map((face, index) => (
          <div 
            key={index}
            className="bg-[#1a0c05]/70 border border-[#e8c28233] rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7e5a39]/60 flex items-center justify-center text-[#e8c282] font-serif text-lg">
                {face.index + 1}
              </div>
              <div>
                <p className="text-[#edd6ae] font-serif">{face.mood}</p>
                <p className="text-[#edd6ae]/60 text-xs">
                  {format(face.timestamp, "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedFacesHistory;
