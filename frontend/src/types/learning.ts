/**
 * EduCash — Tipagens do Módulo Pedagógico e Gamificação (MVP 1)
 */

export type ActivityType = 'multiple_choice' | 'true_false' | 'matching';

export interface ActivityOption {
  id: string;
  activity_id: string;
  option_key: string;
  option_text: string;
  side?: 'left' | 'right' | null;
  position: number;
}

export interface Activity {
  id: string;
  lesson_id: string;
  title: string;
  description: string;
  activity_type: ActivityType;
  position: number;
  is_active: boolean;
  options: ActivityOption[];
  is_completed?: boolean;
}

export interface LessonSummaryItem {
  lesson_id: string;
  learning_path_id: string;
  title: string;
  description: string;
  position: number;
  is_unlocked: boolean;
  is_completed: boolean;
  completed_activities_count: number;
  total_activities_count: number;
}

export interface LessonDetail {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  introduction: string;
  practical_example: string;
  conclusion: string;
  position: number;
  is_active: boolean;
  is_unlocked: boolean;
  is_completed: boolean;
  activities: Activity[];
}

export interface ActivitySubmissionResult {
  is_correct: boolean;
  feedback: string;
  xp_earned: number;
  coins_earned: number;
  lesson_completed: boolean;
  lesson_bonus_xp: number;
  lesson_bonus_coins: number;
  unlocked_achievements: string[];
}

export interface LevelInfo {
  level: number;
  name: string;
  min_xp: number;
}

export interface UserAchievementItem {
  id: string;
  name: string;
  description: string;
  unlocked_at?: string;
}

export interface LearningSummary {
  user_id: string;
  username: string;
  total_xp: number;
  total_coins: number;
  current_level: LevelInfo;
  next_level: LevelInfo | null;
  completed_activities_count: number;
  completed_lessons_count: number;
  achievements_count: number;
  unlocked_achievements: UserAchievementItem[];
  is_demo_preview?: boolean;
}

