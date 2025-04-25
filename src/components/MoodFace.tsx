
import React from 'react';

interface MoodFaceProps {
  mood: string;
  moodValue: number;
}

const MoodFace: React.FC<MoodFaceProps> = ({ mood, moodValue }) => {
  // Get mood-specific configurations
  const getMoodConfig = () => {
    switch (moodValue) {
      case 0: // GOOD
        return {
          mouthPath: "M 30 65 Q 50 85 70 65",
          eyeSize: 8
        };
      case 1: // OKAY
        return {
          mouthPath: "M 30 70 L 70 70",
          eyeSize: 8
        };
      case 2: // BAD
        return {
          mouthPath: "M 30 75 Q 50 55 70 75",
          eyeSize: 8
        };
      default:
        return {
          mouthPath: "M 30 70 L 70 70",
          eyeSize: 8
        };
    }
  };

  const config = getMoodConfig();

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 10px rgba(232, 194, 130, 0.2))' }}
      >
        {/* Face Circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#e8c282"
          className="transition-all duration-300"
        />
        
        {/* Left Eye */}
        <circle
          cx="35"
          cy="40"
          r={config.eyeSize}
          fill="#2a180f"
          className="transition-all duration-300"
        />
        
        {/* Right Eye */}
        <circle
          cx="65"
          cy="40"
          r={config.eyeSize}
          fill="#2a180f"
          className="transition-all duration-300"
        />
        
        {/* Mouth */}
        <path
          d={config.mouthPath}
          stroke="#2a180f"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>

      {/* Mood Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-4 text-center">
        <h3 className="text-2xl font-serif text-[#e8c282] mb-1">
          {mood}
        </h3>
        <p className="text-sm text-[#e8c282]/70">
          Swipe left or right to explore moods
        </p>
      </div>
    </div>
  );
};

export default MoodFace;
