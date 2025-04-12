export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      apartments: {
        Row: {
          block_id: string
          created_at: string
          floor: number
          id: string
          number: string
          updated_at: string
        }
        Insert: {
          block_id: string
          created_at?: string
          floor: number
          id?: string
          number: string
          updated_at?: string
        }
        Update: {
          block_id?: string
          created_at?: string
          floor?: number
          id?: string
          number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "apartments_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      blocks: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      charges: {
        Row: {
          amount: number
          category: string
          charge_type: string
          created_at: string
          description: string | null
          id: string
          name: string
          period: string
          updated_at: string
        }
        Insert: {
          amount: number
          category?: string
          charge_type: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          period: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          charge_type?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          period?: string
          updated_at?: string
        }
        Relationships: []
      }
      credentials: {
        Row: {
          created_at: string
          domain: string
          email: string
          id: string
          password: string
        }
        Insert: {
          created_at?: string
          domain: string
          email: string
          id?: string
          password: string
        }
        Update: {
          created_at?: string
          domain?: string
          email?: string
          id?: string
          password?: string
        }
        Relationships: []
      }
      imap_configurations: {
        Row: {
          created_at: string
          domain: string
          host: string
          id: string
          port: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain: string
          host: string
          id?: string
          port: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string
          host?: string
          id?: string
          port?: number
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          charge_id: string | null
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_for_month: string
          payment_for_year: string
          payment_method: string
          payment_status: string
          payment_type: string
          resident_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          charge_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date: string
          payment_for_month: string
          payment_for_year: string
          payment_method: string
          payment_status?: string
          payment_type: string
          resident_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          charge_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_for_month?: string
          payment_for_year?: string
          payment_method?: string
          payment_status?: string
          payment_type?: string
          resident_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      resident_apartments: {
        Row: {
          apartment_number: string
          block_number: string
          created_at: string
          id: string
          resident_id: string
          updated_at: string
        }
        Insert: {
          apartment_number: string
          block_number: string
          created_at?: string
          id?: string
          resident_id: string
          updated_at?: string
        }
        Update: {
          apartment_number?: string
          block_number?: string
          created_at?: string
          id?: string
          resident_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resident_apartments_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      residents: {
        Row: {
          apartment_number: string
          block_number: string
          created_at: string
          created_by: string | null
          full_name: string
          id: string
          move_in_month: string | null
          move_in_year: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          apartment_number: string
          block_number: string
          created_at?: string
          created_by?: string | null
          full_name: string
          id?: string
          move_in_month?: string | null
          move_in_year?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          apartment_number?: string
          block_number?: string
          created_at?: string
          created_by?: string | null
          full_name?: string
          id?: string
          move_in_month?: string | null
          move_in_year?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_resident_apartment: {
        Args: {
          p_resident_id: string
          p_block_number: string
          p_apartment_number: string
        }
        Returns: undefined
      }
      get_charge_types: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_resident_apartments: {
        Args: Record<PropertyKey, never>
        Returns: {
          resident_id: string
          block_number: string
          apartment_number: string
        }[]
      }
      remove_resident_apartment: {
        Args: {
          p_resident_id: string
          p_block_number: string
          p_apartment_number: string
        }
        Returns: undefined
      }
      update_resident_with_apartment: {
        Args: {
          p_resident_id: string
          p_full_name: string
          p_phone_number: string
          p_block_number: string
          p_apartment_number: string
          p_move_in_month: string
          p_move_in_year: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
