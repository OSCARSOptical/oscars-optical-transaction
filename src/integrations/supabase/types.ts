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
      patients: {
        Row: {
          address: string | null
          age: number | null
          contact_number: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          patient_code: string | null
          sex: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          patient_code?: string | null
          sex?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          patient_code?: string | null
          sex?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          photo_url: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      refractions: {
        Row: {
          add_power: string | null
          id: string
          near_va: string | null
          od_axis: string | null
          od_cylinder: string | null
          od_sphere: string | null
          od_va: string | null
          os_axis: string | null
          os_cylinder: string | null
          os_sphere: string | null
          os_va: string | null
          transaction_id: string | null
          type: string | null
        }
        Insert: {
          add_power?: string | null
          id?: string
          near_va?: string | null
          od_axis?: string | null
          od_cylinder?: string | null
          od_sphere?: string | null
          od_va?: string | null
          os_axis?: string | null
          os_cylinder?: string | null
          os_sphere?: string | null
          os_va?: string | null
          transaction_id?: string | null
          type?: string | null
        }
        Update: {
          add_power?: string | null
          id?: string
          near_va?: string | null
          od_axis?: string | null
          od_cylinder?: string | null
          od_sphere?: string | null
          od_va?: string | null
          os_axis?: string | null
          os_cylinder?: string | null
          os_sphere?: string | null
          os_va?: string | null
          transaction_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refractions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          attending_doctor: string | null
          balance: number | null
          claimed: boolean | null
          claimed_on: string | null
          created_at: string | null
          deposit: number | null
          doctor_remarks: string | null
          edging_price: number | null
          gross_amount: number | null
          id: string
          interpupillary_distance: number | null
          lens_capital: number | null
          lens_coating: string | null
          lens_type: string | null
          net_income: number | null
          notes: string | null
          other_expenses: number | null
          patient_id: string | null
          refractive_index: string | null
          tint: string | null
          total_expenses: number | null
          transaction_code: string | null
          transaction_date: string | null
          transaction_type: string | null
        }
        Insert: {
          attending_doctor?: string | null
          balance?: number | null
          claimed?: boolean | null
          claimed_on?: string | null
          created_at?: string | null
          deposit?: number | null
          doctor_remarks?: string | null
          edging_price?: number | null
          gross_amount?: number | null
          id?: string
          interpupillary_distance?: number | null
          lens_capital?: number | null
          lens_coating?: string | null
          lens_type?: string | null
          net_income?: number | null
          notes?: string | null
          other_expenses?: number | null
          patient_id?: string | null
          refractive_index?: string | null
          tint?: string | null
          total_expenses?: number | null
          transaction_code?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
        }
        Update: {
          attending_doctor?: string | null
          balance?: number | null
          claimed?: boolean | null
          claimed_on?: string | null
          created_at?: string | null
          deposit?: number | null
          doctor_remarks?: string | null
          edging_price?: number | null
          gross_amount?: number | null
          id?: string
          interpupillary_distance?: number | null
          lens_capital?: number | null
          lens_coating?: string | null
          lens_type?: string | null
          net_income?: number | null
          notes?: string | null
          other_expenses?: number | null
          patient_id?: string | null
          refractive_index?: string | null
          tint?: string | null
          total_expenses?: number | null
          transaction_code?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "Admin" | "Doctor" | "Staff"
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
    Enums: {
      user_role: ["Admin", "Doctor", "Staff"],
    },
  },
} as const
