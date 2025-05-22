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
      brands: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "brands_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          brand_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "models_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "models_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_history: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          service_id: string | null
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          service_id?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          service_id?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_history_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "service_history_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_parts: {
        Row: {
          created_at: string | null
          id: string
          part_code: string | null
          part_name: string
          quantity: number
          service_id: string | null
          tenant_id: string | null
          total_price: number | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          part_code?: string | null
          part_name: string
          quantity?: number
          service_id?: string | null
          tenant_id?: string | null
          total_price?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          part_code?: string | null
          part_name?: string
          quantity?: number
          service_id?: string | null
          tenant_id?: string | null
          total_price?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_parts_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_parts_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_parts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "service_parts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          arrival_date: string | null
          complaint: string | null
          created_at: string | null
          delivery_date: string | null
          id: string
          labor_cost: number | null
          mileage: number | null
          parts_cost: number | null
          status: string
          technician_id: string | null
          tenant_id: string | null
          total_cost: number | null
          updated_at: string | null
          vehicle_id: string | null
          work_done: string | null
        }
        Insert: {
          arrival_date?: string | null
          complaint?: string | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          labor_cost?: number | null
          mileage?: number | null
          parts_cost?: number | null
          status: string
          technician_id?: string | null
          tenant_id?: string | null
          total_cost?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
          work_done?: string | null
        }
        Update: {
          arrival_date?: string | null
          complaint?: string | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          labor_cost?: number | null
          mileage?: number | null
          parts_cost?: number | null
          status?: string
          technician_id?: string | null
          tenant_id?: string | null
          total_cost?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
          work_done?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "services_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string
          status: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role: string
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand_id: string | null
          chassis_number: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          mileage: number | null
          model_id: string | null
          plate_number: string
          tenant_id: string | null
          under_warranty: boolean | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          brand_id?: string | null
          chassis_number?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          mileage?: number | null
          model_id?: string | null
          plate_number: string
          tenant_id?: string | null
          under_warranty?: boolean | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          brand_id?: string | null
          chassis_number?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          mileage?: number | null
          model_id?: string | null
          plate_number?: string
          tenant_id?: string | null
          under_warranty?: boolean | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "vehicles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      dashboard_stats: {
        Row: {
          active_vehicles: number | null
          delivered_this_month: number | null
          monthly_revenue: number | null
          tenant_id: string | null
          yearly_revenue: number | null
        }
        Insert: {
          active_vehicles?: never
          delivered_this_month?: never
          monthly_revenue?: never
          tenant_id?: string | null
          yearly_revenue?: never
        }
        Update: {
          active_vehicles?: never
          delivered_this_month?: never
          monthly_revenue?: never
          tenant_id?: string | null
          yearly_revenue?: never
        }
        Relationships: []
      }
      service_details: {
        Row: {
          arrival_date: string | null
          brand_name: string | null
          complaint: string | null
          created_at: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_date: string | null
          id: string | null
          labor_cost: number | null
          mileage: number | null
          model_name: string | null
          parts_cost: number | null
          parts_count: number | null
          plate_number: string | null
          status: string | null
          technician_name: string | null
          tenant_id: string | null
          total_cost: number | null
          updated_at: string | null
          work_done: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "services_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_details: {
        Row: {
          brand_name: string | null
          chassis_number: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string | null
          last_service_date: string | null
          mileage: number | null
          model_name: string | null
          plate_number: string | null
          service_count: number | null
          tenant_id: string | null
          under_warranty: boolean | null
          updated_at: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "vehicles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_tenant_with_user: {
        Args: {
          tenant_name: string
          user_email: string
          user_password: string
          user_first_name?: string
          user_last_name?: string
          user_phone?: string
          user_role?: string
        }
        Returns: Json
      }
      get_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      setup_user_tenant: {
        Args: {
          user_id: string
          tenant_name: string
          user_email: string
          user_first_name?: string
          user_last_name?: string
          user_phone?: string
          user_role?: string
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
