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
  {
    dayOffset: 0,
    startTime: "08:30",
    endTime: "09:00",
    title: "Morning Review",
    person: "Personal",
    color: "#7e5a39",
    location: "Home Office",
    icon: "☕"
  },
  {
    dayOffset: 0,
    startTime: "10:00",
    endTime: "11:30",
    title: "Weekly Team Meeting",
    person: "Team",
    color: "#e8c282",
    location: "Conference Room B",
    icon: "👥"
  },
  {
    dayOffset: 0,
    startTime: "13:00",
    endTime: "14:00",
    title: "Lunch Break",
    person: "Personal",
    color: "#8B784A",
    location: "Cafeteria",
    icon: "🍽️"
  },
  {
    dayOffset: 0,
    startTime: "15:30",
    endTime: "16:30",
    title: "Project Planning",
    person: "Client",
    color: "#A48C64",
    location: "Meeting Room 3",
    icon: "📝"
  },
  {
    dayOffset: 0,
    startTime: "17:00",
    endTime: "17:30",
    title: "Daily Wrap-up",
    person: "Personal",
    color: "#D6BC8A",
    location: "Home Office",
    icon: "🏁"
  },
  // Tomorrow events
  {
    dayOffset: 1,
    startTime: "08:00",
    endTime: "09:00",
    title: "Morning Exercise",
    person: "Personal",
    color: "#7e5a39",
    location: "Gym",
    icon: "🏋️"
  },
  {
    dayOffset: 1,
    startTime: "09:30",
    endTime: "10:30",
    title: "Client Call",
    person: "Work",
    color: "#e8c282",
    location: "Office",
    icon: "📞"
  },
  {
    dayOffset: 1,
    startTime: "12:00",
    endTime: "13:00",
    title: "Lunch with Sarah",
    person: "Social",
    color: "#A48C64",
    location: "Italian Restaurant",
    icon: "🍝"
  },
  {
    dayOffset: 1,
    startTime: "14:30",
    endTime: "16:00",
    title: "Product Demo",
    person: "Work",
    color: "#8B784A",
    location: "Conference Room",
    icon: "💻"
  },
  {
    dayOffset: 1,
    startTime: "17:30",
    endTime: "18:30",
    title: "Evening Yoga",
    person: "Personal",
    color: "#D6BC8A",
    location: "Yoga Studio",
    icon: "🧘"
  },
  // Day after tomorrow
  {
    dayOffset: 2,
    startTime: "07:30",
    endTime: "08:30",
    title: "Morning Run",
    person: "Personal",
    color: "#7e5a39",
    location: "Park",
    icon: "🏃"
  },
  {
    dayOffset: 2,
    startTime: "09:00",
    endTime: "10:30",
    title: "Strategy Meeting",
    person: "Work",
    color: "#e8c282",
    location: "Board Room",
    icon: "🧠"
  },
  {
    dayOffset: 2,
    startTime: "11:00",
    endTime: "12:30",
    title: "Design Review",
    person: "Work",
    color: "#8B784A",
    location: "Design Lab",
    icon: "🎨"
  },
  {
    dayOffset: 2,
    startTime: "13:00",
    endTime: "14:00",
    title: "Lunch",
    person: "Personal",
    color: "#A48C64",
    location: "Cafeteria",
    icon: "🥗"
  },
  {
    dayOffset: 2,
    startTime: "15:00",
    endTime: "16:30",
    title: "Project Deadline",
    person: "Work",
    color: "#D6BC8A",
    location: "Office",
    icon: "⏰"
  },
  // Next week events (day 7)
  {
    dayOffset: 7,
    startTime: "08:00",
    endTime: "09:30",
    title: "Weekly Planning",
    person: "Work",
    color: "#7e5a39",
    location: "Office",
    icon: "📅"
  },
  {
    dayOffset: 7,
    startTime: "10:00",
    endTime: "11:30",
    title: "Team Building",
    person: "Team",
    color: "#e8c282",
    location: "Conference Hall",
    icon: "🤝"
  },
  {
    dayOffset: 7,
    startTime: "13:00",
    endTime: "14:00",
    title: "Lunch with Team",
    person: "Social",
    color: "#8B784A",
    location: "Restaurant",
    icon: "🍔"
  },
  {
    dayOffset: 7,
    startTime: "15:00",
    endTime: "16:30",
    title: "Quarterly Review",
    person: "Management",
    color: "#A48C64",
    location: "Meeting Room 1",
    icon: "📊"
  },
  {
    dayOffset: 7,
    startTime: "17:00",
    endTime: "18:00",
    title: "Networking Event",
    person: "Professional",
    color: "#D6BC8A",
    location: "Business Center",
    icon: "🌐"
  },
  // Two weeks out (day 14)
  {
    dayOffset: 14,
    startTime: "09:00",
    endTime: "10:30",
    title: "Conference Call",
    person: "Work",
    color: "#7e5a39",
    location: "Virtual",
    icon: "🎤"
  },
  {
    dayOffset: 14,
    startTime: "11:00",
    endTime: "12:30",
    title: "Client Presentation",
    person: "Client",
    color: "#e8c282",
    location: "Client Office",
    icon: "📢"
  },
  {
    dayOffset: 14,
    startTime: "14:00",
    endTime: "15:30",
    title: "Product Launch",
    person: "Marketing",
    color: "#8B784A",
    location: "Venue Hall",
    icon: "🚀"
  },
  {
    dayOffset: 14,
    startTime: "16:00",
    endTime: "17:00",
    title: "Stakeholder Meeting",
    person: "Executive",
    color: "#A48C64",
    location: "Board Room",
    icon: "👔"
  },
  {
    dayOffset: 14,
    startTime: "18:00",
    endTime: "20:00",
    title: "Team Dinner",
    person: "Social",
    color: "#D6BC8A",
    location: "Restaurant",
    icon: "🍽️"
  }
];
