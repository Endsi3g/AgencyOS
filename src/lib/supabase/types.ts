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
            activities: {
                Row: {
                    client_id: string | null
                    created_at: string
                    created_by: string | null
                    description: string | null
                    id: string
                    lead_id: string | null
                    type: string
                }
                Insert: {
                    client_id?: string | null
                    created_at?: string
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    lead_id?: string | null
                    type: string
                }
                Update: {
                    client_id?: string | null
                    created_at?: string
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    lead_id?: string | null
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "activities_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "activities_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "activities_lead_id_fkey"
                        columns: ["lead_id"]
                        isOneToOne: false
                        referencedRelation: "leads"
                        referencedColumns: ["id"]
                    },
                ]
            }
            clients: {
                Row: {
                    address: string | null
                    created_at: string
                    id: string
                    industry: string | null
                    name: string
                    org_id: string
                    website: string | null
                }
                Insert: {
                    address?: string | null
                    created_at?: string
                    id?: string
                    industry?: string | null
                    name: string
                    org_id: string
                    website?: string | null
                }
                Update: {
                    address?: string | null
                    created_at?: string
                    id?: string
                    industry?: string | null
                    name?: string
                    org_id?: string
                    website?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "clients_org_id_fkey"
                        columns: ["org_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contacts: {
                Row: {
                    client_id: string | null
                    created_at: string
                    email: string | null
                    first_name: string
                    id: string
                    last_name: string | null
                    org_id: string
                    phone: string | null
                    position: string | null
                }
                Insert: {
                    client_id?: string | null
                    created_at?: string
                    email?: string | null
                    first_name: string
                    id?: string
                    last_name?: string | null
                    org_id: string
                    phone?: string | null
                    position?: string | null
                }
                Update: {
                    client_id?: string | null
                    created_at?: string
                    email?: string | null
                    first_name?: string
                    id?: string
                    last_name?: string | null
                    org_id?: string
                    phone?: string | null
                    position?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "contacts_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contacts_org_id_fkey"
                        columns: ["org_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            files: {
                Row: {
                    created_at: string
                    id: string
                    name: string
                    org_id: string
                    project_id: string | null
                    size: number | null
                    type: string | null
                    uploaded_by: string | null
                    url: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    name: string
                    org_id: string
                    project_id?: string | null
                    size?: number | null
                    type?: string | null
                    uploaded_by?: string | null
                    url: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    name?: string
                    org_id?: string
                    project_id?: string | null
                    size?: number | null
                    type?: string | null
                    uploaded_by?: string | null
                    url?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "files_org_id_fkey"
                        columns: ["org_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "files_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "files_uploaded_by_fkey"
                        columns: ["uploaded_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            invoice_items: {
                Row: {
                    amount: number | null
                    description: string
                    id: string
                    invoice_id: string
                    quantity: number | null
                    unit_price: number | null
                }
                Insert: {
                    amount?: never
                    description: string
                    id?: string
                    invoice_id: string
                    quantity?: number | null
                    unit_price?: number | null
                }
                Update: {
                    amount?: never
                    description?: string
                    id?: string
                    invoice_id?: string
                    quantity?: number | null
                    unit_price?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "invoice_items_invoice_id_fkey"
                        columns: ["invoice_id"]
                        isOneToOne: false
                        referencedRelation: "invoices"
                        referencedColumns: ["id"]
                    },
                ]
            }
            invoices: {
                Row: {
                    amount: number | null
                    client_id: string | null
                    created_at: string
                    currency: string | null
                    due_date: string | null
                    id: string
                    invoice_number: string | null
                    issue_date: string | null
                    org_id: string
                    paid_at: string | null
                    project_id: string | null
                    status: string | null
                }
                Insert: {
                    amount?: number | null
                    client_id?: string | null
                    created_at?: string
                    currency?: string | null
                    due_date?: string | null
                    id?: string
                    invoice_number?: string | null
                    issue_date?: string | null
                    org_id: string
                    paid_at?: string | null
                    project_id?: string | null
                    status?: string | null
                }
                Update: {
                    amount?: number | null
                    client_id?: string | null
                    created_at?: string
                    currency?: string | null
                    due_date?: string | null
                    id?: string
                    invoice_number?: string | null
                    issue_date?: string | null
                    org_id?: string
                    paid_at?: string | null
                    project_id?: string | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "invoices_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "invoices_org_id_fkey"
                        columns: ["org_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "invoices_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            leads: {
                Row: {
                    assigned_to: string | null
                    company_name: string | null
                    created_at: string
                    email: string | null
                    id: string
                    name: string
                    org_id: string
                    phone: string | null
                    source: string | null
                    status: string | null
                    value: number | null
                }
                Insert: {
                    assigned_to?: string | null
                    company_name?: string | null
                    created_at?: string
                    email?: string | null
                    id?: string
                    name: string
                    org_id: string
                    phone?: string | null
                    source?: string | null
                    status?: string | null
                    value?: number | null
                }
                Update: {
                    assigned_to?: string | null
                    company_name?: string | null
                    created_at?: string
                    email?: string | null
                    id?: string
                    name?: string
                    org_id?: string
                    phone?: string | null
                    source?: string | null
                    status?: string | null
                    value?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "leads_assigned_to_fkey"
                        columns: ["assigned_to"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "leads_org_id_fkey"
                        columns: ["org_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            organizations: {
                Row: {
                    created_at: string
                    id: string
                    name: string
                    settings: Json | null
                    slug: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    name: string
                    settings?: Json | null
                    slug: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    name?: string
                    settings?: Json | null
                    slug?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    email: string | null
                    full_name: string | null
                    id: string
                    org_id: string | null
                    role: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    full_name?: string | null
                    id: string
                    org_id?: string | null
                    role?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    org_id?: string | null
                    role?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_org_id_fkey"
                        columns: ["org_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            projects: {
                Row: {
                    budget: number | null
                    client_id: string | null
                    created_at: string
                    description: string | null
                    end_date: string | null
                    id: string
                    manager_id: string | null
                    name: string
                    org_id: string
                    start_date: string | null
                    status: string | null
                }
                Insert: {
                    budget?: number | null
                    client_id?: string | null
                    created_at?: string
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    manager_id?: string | null
                    name: string
                    org_id: string
                    start_date?: string | null
                    status?: string | null
                }
                Update: {
                    budget?: number | null
                    client_id?: string | null
                    created_at?: string
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    manager_id?: string | null
                    name?: string
                    org_id?: string
                    start_date?: string | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "projects_manager_id_fkey"
                        columns: ["manager_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "projects_org_id_fkey"
                        columns: ["org_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            proposals: {
                Row: {
                    client_id: string | null
                    content: Json | null
                    created_at: string
                    id: string
                    org_id: string
                    signature_data: string | null
                    signed_at: string | null
                    status: string | null
                    title: string
                }
                Insert: {
                    client_id?: string | null
                    content?: Json | null
                    created_at?: string
                    id?: string
                    org_id: string
                    signature_data?: string | null
                    signed_at?: string | null
                    status?: string | null
                    title: string
                }
                Update: {
                    client_id?: string | null
                    content?: Json | null
                    created_at?: string
                    id?: string
                    org_id?: string
                    signature_data?: string | null
                    signed_at?: string | null
                    status?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "proposals_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "proposals_org_id_fkey"
                        columns: ["org_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tasks: {
                Row: {
                    assignee_id: string | null
                    created_at: string
                    description: string | null
                    due_date: string | null
                    estimated_hours: number | null
                    id: string
                    priority: string | null
                    project_id: string
                    status: string | null
                    title: string
                }
                Insert: {
                    assignee_id?: string | null
                    created_at?: string
                    description?: string | null
                    due_date?: string | null
                    estimated_hours?: number | null
                    id?: string
                    priority?: string | null
                    project_id: string
                    status?: string | null
                    title: string
                }
                Update: {
                    assignee_id?: string | null
                    created_at?: string
                    description?: string | null
                    due_date?: string | null
                    estimated_hours?: number | null
                    id?: string
                    priority?: string | null
                    project_id?: string
                    status?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tasks_assignee_id_fkey"
                        columns: ["assignee_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tasks_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            time_entries: {
                Row: {
                    created_at: string
                    date: string | null
                    duration: number
                    id: string
                    notes: string | null
                    task_id: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    date?: string | null
                    duration: number
                    id?: string
                    notes?: string | null
                    task_id?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string
                    date?: string | null
                    duration?: number
                    id?: string
                    notes?: string | null
                    task_id?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "time_entries_task_id_fkey"
                        columns: ["task_id"]
                        isOneToOne: false
                        referencedRelation: "tasks"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "time_entries_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
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
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
