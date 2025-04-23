
export const EMOJI_OPTIONS = [
  "📅", "📝", "📌", "🔔", "⏰", "🏃", "🍽️", "☕", 
  "🧠", "💼", "👥", "📞", "🎯", "🎮", "🛌", "🚗", 
  "✈️", "🏠", "🏢", "🏋️", "📚", "💻", "🎵", "🎨",
  "🎬", "🎭", "🎪", "🎾", "⚽", "🏀", "🏈", "⚾",
  "🎣", "🎱", "🎲", "🚴", "🚶", "🏄", "🚀", "🌈",
  "🌞", "🌙", "🌊", "🔥", "💧", "❄️", "🌱", "🍀",
  "🔑", "📱", "📺", "🧹", "🧘", "🎁", "🛒", "🛠️",
  "🔍", "👨‍💻", "👩‍💼", "🍵", "🍷", "🥂", "🥗", "🍣"
];

export const COLOR_OPTIONS = [
  "#7e5a39", // Brown (primary)
  "#e8c282", // Gold
  "#8B784A", // Earth
  "#A48C64", // Light brown
  "#D6BC8A", // Beige
  "#5D4824", // Dark brown
  "#B9975B", // Amber
  "#CBA76B", // Tan
  "#C8B090", // Khaki
  "#AA8C68", // Camel
  "#9C7A3C", // Bronze
  "#D4B16A", // Honey
  "#BFA36F", // Sand
  "#AA8855", // Caramel
  "#7D6945", // Umber
  "#6B5836"  // Coffee
];

export const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", 
  "Thursday", "Friday", "Saturday"
];

// Sample events for the next few weeks
export const SAMPLE_EVENTS = [
  // This week
  {
    title: "Morning Meditation",
    startTime: "07:00",
    endTime: "07:30",
    person: "Personal",
    location: "Home",
    color: "#7e5a39",
    icon: "🧘",
    dayOffset: 0, // Today
  },
  {
    title: "Project Status Meeting",
    startTime: "10:00",
    endTime: "11:00",
    person: "Work",
    location: "Conference Room B",
    color: "#B9975B",
    icon: "💼",
    dayOffset: 0, // Today
  },
  {
    title: "Lunch with Alex",
    startTime: "12:30",
    endTime: "13:30",
    person: "Social",
    location: "Cafe Mocha",
    color: "#D4B16A",
    icon: "🍽️",
    dayOffset: 0, // Today
  },
  {
    title: "Gym Session",
    startTime: "18:00",
    endTime: "19:00",
    person: "Personal",
    location: "Fitness Center",
    color: "#5D4824",
    icon: "🏋️",
    dayOffset: 1, // Tomorrow
  },
  {
    title: "Design Review",
    startTime: "14:00",
    endTime: "15:30",
    person: "Work",
    location: "Meeting Room 3",
    color: "#8B784A",
    icon: "🎨",
    dayOffset: 1, // Tomorrow
  },
  {
    title: "Dinner with Family",
    startTime: "19:30",
    endTime: "21:00",
    person: "Personal",
    location: "Mom's House",
    color: "#CBA76B",
    icon: "👥",
    dayOffset: 2,
  },
  {
    title: "Client Call",
    startTime: "11:00",
    endTime: "11:30",
    person: "Work",
    location: "Office",
    color: "#9C7A3C",
    icon: "📞",
    dayOffset: 2,
  },
  {
    title: "Book Club Meeting",
    startTime: "19:00",
    endTime: "20:30",
    person: "Social",
    location: "Library",
    color: "#BFA36F",
    icon: "📚",
    dayOffset: 3,
  },
  // Next week
  {
    title: "Team Building",
    startTime: "09:00",
    endTime: "17:00",
    person: "Work",
    location: "Park",
    color: "#7e5a39",
    icon: "🎮",
    dayOffset: 7,
  },
  {
    title: "Doctor Appointment",
    startTime: "14:00",
    endTime: "15:00",
    person: "Personal",
    location: "Medical Center",
    color: "#5D4824",
    icon: "🏥",
    dayOffset: 8,
  },
  {
    title: "Movie Night",
    startTime: "20:00",
    endTime: "22:00",
    person: "Social",
    location: "Cinema",
    color: "#D4B16A",
    icon: "🎬",
    dayOffset: 9,
  },
  {
    title: "Quarterly Planning",
    startTime: "09:00",
    endTime: "12:00",
    person: "Work",
    location: "Conference Room",
    color: "#B9975B",
    icon: "📝",
    dayOffset: 10,
  },
  // Two weeks from now
  {
    title: "Vacation Start",
    startTime: "08:00",
    endTime: "10:00",
    person: "Personal",
    location: "Airport",
    color: "#CBA76B",
    icon: "✈️",
    dayOffset: 14,
  },
  {
    title: "Beach Day",
    startTime: "10:00",
    endTime: "17:00",
    person: "Personal",
    location: "Seaside",
    color: "#BFA36F",
    icon: "🏄",
    dayOffset: 15,
  },
  {
    title: "Hiking Trip",
    startTime: "09:00",
    endTime: "16:00",
    person: "Social",
    location: "Mountains",
    color: "#8B784A",
    icon: "🚶",
    dayOffset: 16,
  },
];
