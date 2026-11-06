/**
 * EduCash — Tipagens do Banco de Dados PostgreSQL / Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          theme: 'light' | 'dark';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: 'light' | 'dark';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          theme?: 'light' | 'dark';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_paths: {
        Row: {
          id: string;
          title: string;
          description: string;
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          position: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          position?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          learning_path_id: string;
          title: string;
          description: string;
          introduction: string;
          practical_example: string;
          conclusion: string;
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          learning_path_id: string;
          title: string;
          description: string;
          introduction: string;
          practical_example: string;
          conclusion: string;
          position: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          learning_path_id?: string;
          title?: string;
          description?: string;
          introduction?: string;
          practical_example?: string;
          conclusion?: string;
          position?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          description: string;
          activity_type: 'multiple_choice' | 'true_false' | 'matching';
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          title: string;
          description: string;
          activity_type: 'multiple_choice' | 'true_false' | 'matching';
          position: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          title?: string;
          description?: string;
          activity_type?: 'multiple_choice' | 'true_false' | 'matching';
          position?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      activity_options: {
        Row: {
          id: string;
          activity_id: string;
          option_key: string;
          option_text: string;
          side: 'left' | 'right' | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          option_key: string;
          option_text: string;
          side?: 'left' | 'right' | null;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string;
          option_key?: string;
          option_text?: string;
          side?: 'left' | 'right' | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_activity_progress: {
        Row: {
          user_id: string;
          activity_id: string;
          first_completed_at: string;
          attempts_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          activity_id: string;
          first_completed_at?: string;
          attempts_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          activity_id?: string;
          first_completed_at?: string;
          attempts_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          user_id: string;
          lesson_id: string;
          unlocked_at: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          lesson_id: string;
          unlocked_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          lesson_id?: string;
          unlocked_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reward_transactions: {
        Row: {
          id: string;
          user_id: string;
          xp_amount: number;
          coins_amount: number;
          transaction_type: 'activity_first_correct' | 'lesson_completion';
          reference_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          xp_amount: number;
          coins_amount: number;
          transaction_type: 'activity_first_correct' | 'lesson_completion';
          reference_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          xp_amount?: number;
          coins_amount?: number;
          transaction_type?: 'activity_first_correct' | 'lesson_completion';
          reference_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      level_definitions: {
        Row: {
          level: number;
          name: string;
          min_xp: number;
          created_at: string;
        };
        Insert: {
          level: number;
          name: string;
          min_xp: number;
          created_at?: string;
        };
        Update: {
          level?: number;
          name?: string;
          min_xp?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          username: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_public_username: {
        Args: { p_user_id: string };
        Returns: string;
      };
      get_available_lessons: {
        Args: Record<string, never>;
        Returns: {
          lesson_id: string;
          learning_path_id: string;
          title: string;
          description: string;
          position: number;
          is_unlocked: boolean;
          is_completed: boolean;
          completed_activities_count: number;
          total_activities_count: number;
        }[];
      };
      get_user_learning_summary: {
        Args: Record<string, never>;
        Returns: {
          user_id: string;
          username: string;
          total_xp: number;
          total_coins: number;
          current_level: {
            level: number;
            name: string;
            min_xp: number;
          };
          next_level: {
            level: number;
            name: string;
            min_xp: number;
          } | null;
          completed_activities_count: number;
          completed_lessons_count: number;
          achievements_count: number;
          unlocked_achievements: {
            id: string;
            name: string;
            description: string;
            unlocked_at: string;
          }[];
        };
      };
      submit_activity_answer: {
        Args: {
          p_activity_id: string;
          p_submitted_answer: Json;
        };
        Returns: {
          is_correct: boolean;
          feedback: string;
          xp_earned: number;
          coins_earned: number;
          lesson_completed: boolean;
          lesson_bonus_xp: number;
          lesson_bonus_coins: number;
          unlocked_achievements: string[];
        };
      };
    };
  };
}
