// src/lib/supabase.ts
// Supabase client — dùng ở cả client và server

import { createClient } from '@supabase/supabase-js'
import type { Wish, Relationship } from '@/types/wishes'

// ----------------------------------------------------------------
// Database type (generated từ Supabase, đơn giản hóa ở đây)
// ----------------------------------------------------------------
export interface Database {
    public: {
        Tables: {
            wishes: {
                Row: Wish
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    email?: string
                    phone?: string
                    relationship: Relationship
                    attending?: boolean
                    guest_count?: number
                    message: string
                    hearts?: number
                    is_approved?: boolean
                    is_pinned?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    email?: string
                    phone?: string
                    relationship?: Relationship
                    attending?: boolean
                    guest_count?: number
                    message?: string
                    hearts?: number
                    is_approved?: boolean
                    is_pinned?: boolean
                }
            }
        }
        Functions: {
            increment_hearts: {
                Args: {
                    wish_id: string
                }
                Returns: null
            }
        }
    }
}

// ----------------------------------------------------------------
// CLIENT-SIDE Supabase (anon key — dùng trong React components)
// ----------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton để tránh tạo nhiều connection
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
    if (!clientInstance) {
        clientInstance = createClient<Database>(supabaseUrl, supabaseAnon, {
            realtime: {
                params: { eventsPerSecond: 10 },
            },
        })
    }
    return clientInstance
}

// ----------------------------------------------------------------
// SERVER-SIDE Supabase (service_role key — dùng trong API routes)
// Chỉ import file này ở server, KHÔNG bao giờ expose ra client
// ----------------------------------------------------------------
export function getSupabaseAdmin() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient<Database>(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
}