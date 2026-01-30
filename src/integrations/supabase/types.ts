export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: number
          season_id: number
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: number
          season_id: number
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: number
          season_id?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      motivational_messages: {
        Row: {
          child_user_id: string
          created_at: string | null
          id: number
          is_read: boolean | null
          message: string
          message_type: string | null
          parent_user_id: string
          read_at: string | null
          season_id: number
        }
        Insert: {
          child_user_id: string
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message: string
          message_type?: string | null
          parent_user_id: string
          read_at?: string | null
          season_id: number
        }
        Update: {
          child_user_id?: string
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          parent_user_id?: string
          read_at?: string | null
          season_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "motivational_messages_child_user_id_fkey"
            columns: ["child_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motivational_messages_parent_user_id_fkey"
            columns: ["parent_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motivational_messages_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motivational_messages_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }

      rescues: {
        Row: {
          classification_upgrade: boolean | null
          created_at: string | null
          description: string | null
          id: number
          recorded_at: string | null
          season_id: number
          type: string
          user_id: string
          value: number
        }
        Insert: {
          classification_upgrade?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          recorded_at?: string | null
          season_id: number
          type: string
          user_id: string
          value: number
        }
        Update: {
          classification_upgrade?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          recorded_at?: string | null
          season_id?: number
          type?: string
          user_id?: string
          value: number
        }
        Relationships: [
          {
            foreignKeyName: "rescues_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rescues_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rescues_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          child_signature: string | null
          classification: string | null
          created_at: string | null
          final_value: number | null
          id: number
          initial_value: number | null
          is_finalized: boolean | null
          is_rescue_week: boolean | null
          month: number
          next_month_goal: string | null
          parent_signature: string | null
          rescue_description: string | null
          total_bonus_value: number | null
          total_goals: number | null
          total_penalty_value: number | null
          total_red_cards: number | null
          total_yellow_cards: number | null
          updated_at: string | null
          user_id: string
          what_to_improve: string | null
          what_went_well: string | null
          year: number
        }
        Insert: {
          child_signature?: string | null
          classification?: string | null
          created_at?: string | null
          final_value?: number | null
          id?: number
          initial_value?: number | null
          is_finalized?: boolean | null
          is_rescue_week?: boolean | null
          month: number
          next_month_goal?: string | null
          parent_signature?: string | null
          rescue_description?: string | null
          total_bonus_value?: number | null
          total_goals?: number | null
          total_penalty_value?: number | null
          total_red_cards?: number | null
          total_yellow_cards?: number | null
          updated_at?: string | null
          user_id: string
          what_to_improve?: string | null
          what_went_well?: string | null
          year: number
        }
        Update: {
          child_signature?: string | null
          classification?: string | null
          created_at?: string | null
          final_value?: number | null
          id?: number
          initial_value?: number | null
          is_finalized?: boolean | null
          is_rescue_week?: boolean | null
          month?: number
          next_month_goal?: string | null
          parent_signature?: string | null
          rescue_description?: string | null
          total_bonus_value?: number | null
          total_goals?: number | null
          total_penalty_value?: number | null
          total_red_cards?: number | null
          total_yellow_cards?: number | null
          updated_at?: string | null
          user_id?: string
          what_to_improve?: string | null
          what_went_well?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "seasons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          child_user_id: string
          completed_at: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: number
          parent_user_id: string
          season_id: number
          status: string | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          child_user_id: string
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: number
          parent_user_id: string
          season_id: number
          status?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          child_user_id?: string
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: number
          parent_user_id?: string
          season_id: number
          status?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_child_user_id_fkey"
            columns: ["child_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_user_id_fkey"
            columns: ["parent_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          role: string | null
          display_name: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          role?: string | null
          display_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          role?: string | null
          display_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }

    }
    Views: {
      season_summary: {
        Row: {
          classification: string | null
          final_value: number | null
          goals_count: number | null
          id: number | null
          initial_value: number | null
          month: number | null
          red_cards_count: number | null
          total_bonus: number | null
          total_penalty: number | null
          user_id: string | null
          year: number | null
          yellow_cards_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seasons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_classification: {
        Args: { red_count: number; yellow_count: number }
        Returns: string
      }
      calculate_final_value: {
        Args: {
          initial_value: number
          total_bonus: number
          total_penalty: number
        }
        Returns: number
      }
      mark_message_as_read: { Args: { message_id: number }; Returns: undefined }
      update_season_totals: { Args: { season_id: number }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
