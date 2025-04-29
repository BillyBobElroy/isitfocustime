// Define the Habit type
export type Habit = {
  name: string;
  streak: number;
  completedToday: boolean;
  datesCompleted: string[];
  reminderTime?: string; // ⏰ add this!
};