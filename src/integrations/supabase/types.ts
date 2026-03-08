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
      briefs: {
        Row: {
          additional_notes: string | null
          brand_description: string | null
          brand_name: string | null
          budget_range: string | null
          created_at: string | null
          id: string
          inspiration_brands: string | null
          key_ingredients: string | null
          packaging_preferences: string | null
          positioning: string | null
          product_types: string[] | null
          status: string | null
          target_audience: string | null
          target_market: string | null
          timeline: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          brand_description?: string | null
          brand_name?: string | null
          budget_range?: string | null
          created_at?: string | null
          id?: string
          inspiration_brands?: string | null
          key_ingredients?: string | null
          packaging_preferences?: string | null
          positioning?: string | null
          product_types?: string[] | null
          status?: string | null
          target_audience?: string | null
          target_market?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          brand_description?: string | null
          brand_name?: string | null
          budget_range?: string | null
          created_at?: string | null
          id?: string
          inspiration_brands?: string | null
          key_ingredients?: string | null
          packaging_preferences?: string | null
          positioning?: string | null
          product_types?: string[] | null
          status?: string | null
          target_audience?: string | null
          target_market?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          project_id: string
          role: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id: string
          role?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contracts: {
        Row: {
          created_at: string | null
          id: string
          pdf_url: string | null
          signed_at: string | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          signed_at?: string | null
          status?: string | null
          title?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          signed_at?: string | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      client_orders: {
        Row: {
          created_at: string | null
          id: string
          items: Json | null
          notes: string | null
          status: string | null
          total: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          status?: string | null
          total?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          status?: string | null
          total?: number | null
          user_id?: string
        }
        Relationships: []
      }
      client_selections: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          quantity: number | null
          user_id: string
          wc_product_id: number
          wc_product_image: string | null
          wc_product_name: string | null
          wc_product_price: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity?: number | null
          user_id: string
          wc_product_id: number
          wc_product_image?: string | null
          wc_product_name?: string | null
          wc_product_price?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity?: number | null
          user_id?: string
          wc_product_id?: number
          wc_product_image?: string | null
          wc_product_name?: string | null
          wc_product_price?: number | null
        }
        Relationships: []
      }
      contract_amendments: {
        Row: {
          certificat_pdf_url: string | null
          contenu_hash: string | null
          contenu_html: string
          created_at: string | null
          id: string
          motif: string
          parent_contract_id: string
          signature_image_url: string | null
          signed_at: string | null
        }
        Insert: {
          certificat_pdf_url?: string | null
          contenu_hash?: string | null
          contenu_html: string
          created_at?: string | null
          id?: string
          motif: string
          parent_contract_id: string
          signature_image_url?: string | null
          signed_at?: string | null
        }
        Update: {
          certificat_pdf_url?: string | null
          contenu_hash?: string | null
          contenu_html?: string
          created_at?: string | null
          id?: string
          motif?: string
          parent_contract_id?: string
          signature_image_url?: string | null
          signed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_amendments_parent_contract_id_fkey"
            columns: ["parent_contract_id"]
            isOneToOne: false
            referencedRelation: "onboarding_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_templates: {
        Row: {
          active: boolean | null
          contenu_html: string
          created_at: string | null
          id: string
          version: string
        }
        Insert: {
          active?: boolean | null
          contenu_html: string
          created_at?: string | null
          id?: string
          version: string
        }
        Update: {
          active?: boolean | null
          contenu_html?: string
          created_at?: string | null
          id?: string
          version?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          created_at: string | null
          id: string
          pdf_url: string | null
          project_id: string
          signature_provider: string | null
          signature_request_id: string | null
          signed_at: string | null
          signer_email: string | null
          signer_name: string | null
          status: string | null
          subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          project_id: string
          signature_provider?: string | null
          signature_request_id?: string | null
          signed_at?: string | null
          signer_email?: string | null
          signer_name?: string | null
          status?: string | null
          subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          project_id?: string
          signature_provider?: string | null
          signature_request_id?: string | null
          signed_at?: string | null
          signer_email?: string | null
          signer_name?: string | null
          status?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_contracts: {
        Row: {
          brand_name: string | null
          certificat_pdf_url: string | null
          contenu_hash: string | null
          contenu_html: string
          created_at: string | null
          id: string
          montant_abonnement: number
          montant_setup: number
          numero_contrat: string
          pack: string
          produits_selectionnes: Json | null
          signature_image_url: string | null
          signature_ip: string | null
          signature_ua: string | null
          signed_at: string | null
          statut: string
          template_id: string | null
          user_id: string
        }
        Insert: {
          brand_name?: string | null
          certificat_pdf_url?: string | null
          contenu_hash?: string | null
          contenu_html: string
          created_at?: string | null
          id?: string
          montant_abonnement?: number
          montant_setup: number
          numero_contrat: string
          pack: string
          produits_selectionnes?: Json | null
          signature_image_url?: string | null
          signature_ip?: string | null
          signature_ua?: string | null
          signed_at?: string | null
          statut?: string
          template_id?: string | null
          user_id: string
        }
        Update: {
          brand_name?: string | null
          certificat_pdf_url?: string | null
          contenu_hash?: string | null
          contenu_html?: string
          created_at?: string | null
          id?: string
          montant_abonnement?: number
          montant_setup?: number
          numero_contrat?: string
          pack?: string
          produits_selectionnes?: Json | null
          signature_image_url?: string | null
          signature_ip?: string | null
          signature_ua?: string | null
          signed_at?: string | null
          statut?: string
          template_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_contracts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "contract_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          id: string
          items: Json | null
          project_id: string
          status: string | null
          total: number | null
          wc_order_id: number | null
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          items?: Json | null
          project_id: string
          status?: string | null
          total?: number | null
          wc_order_id?: number | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          items?: Json | null
          project_id?: string
          status?: string | null
          total?: number | null
          wc_order_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      product_selections: {
        Row: {
          created_at: string
          id: string
          products: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          products?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          products?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          civilite: string | null
          code_postal: string | null
          company_name: string | null
          created_at: string | null
          date_naissance: string | null
          email: string | null
          first_name: string | null
          forme_juridique: string | null
          id: string
          last_name: string | null
          nationalite: string | null
          numero_tva: string | null
          onboarding_completed: boolean | null
          pays: string | null
          phone: string | null
          piece_identite_url: string | null
          raison_sociale: string | null
          rcs_siret: string | null
          representant_nom: string | null
          representant_qualite: string | null
          siege_social: string | null
          siret: string | null
          statut_juridique: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          civilite?: string | null
          code_postal?: string | null
          company_name?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string | null
          first_name?: string | null
          forme_juridique?: string | null
          id: string
          last_name?: string | null
          nationalite?: string | null
          numero_tva?: string | null
          onboarding_completed?: boolean | null
          pays?: string | null
          phone?: string | null
          piece_identite_url?: string | null
          raison_sociale?: string | null
          rcs_siret?: string | null
          representant_nom?: string | null
          representant_qualite?: string | null
          siege_social?: string | null
          siret?: string | null
          statut_juridique?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          civilite?: string | null
          code_postal?: string | null
          company_name?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string | null
          first_name?: string | null
          forme_juridique?: string | null
          id?: string
          last_name?: string | null
          nationalite?: string | null
          numero_tva?: string | null
          onboarding_completed?: boolean | null
          pays?: string | null
          phone?: string | null
          piece_identite_url?: string | null
          raison_sociale?: string | null
          rcs_siret?: string | null
          representant_nom?: string | null
          representant_qualite?: string | null
          siege_social?: string | null
          siret?: string | null
          statut_juridique?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          ai_summary: Json | null
          brand_name: string | null
          created_at: string | null
          id: string
          key_ingredients: string | null
          positioning: string | null
          product_types: string[] | null
          status: string | null
          target_audience: string | null
          target_market: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: Json | null
          brand_name?: string | null
          created_at?: string | null
          id?: string
          key_ingredients?: string | null
          positioning?: string | null
          product_types?: string[] | null
          status?: string | null
          target_audience?: string | null
          target_market?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: Json | null
          brand_name?: string | null
          created_at?: string | null
          id?: string
          key_ingredients?: string | null
          positioning?: string | null
          product_types?: string[] | null
          status?: string | null
          target_audience?: string | null
          target_market?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      selected_products: {
        Row: {
          created_at: string | null
          custom_name: string | null
          custom_price: number | null
          id: string
          project_id: string
          wc_product_id: number
          wc_product_image: string | null
          wc_product_name: string | null
          wc_product_price: number | null
        }
        Insert: {
          created_at?: string | null
          custom_name?: string | null
          custom_price?: number | null
          id?: string
          project_id: string
          wc_product_id: number
          wc_product_image?: string | null
          wc_product_name?: string | null
          wc_product_price?: number | null
        }
        Update: {
          created_at?: string | null
          custom_name?: string | null
          custom_price?: number | null
          id?: string
          project_id?: string
          wc_product_id?: number
          wc_product_image?: string | null
          wc_product_name?: string | null
          wc_product_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "selected_products_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          id: string
          monthly_fee: number | null
          pack_type: string
          payment_mode: string | null
          project_id: string
          setup_fee: number | null
          status: string | null
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          monthly_fee?: number | null
          pack_type?: string
          payment_mode?: string | null
          project_id: string
          setup_fee?: number | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          monthly_fee?: number | null
          pack_type?: string
          payment_mode?: string | null
          project_id?: string
          setup_fee?: number | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_contract_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_owns_project: { Args: { _project_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
