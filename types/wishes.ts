// src/types/wishes.ts

export type Relationship = 'family' | 'friend' | 'relative' | 'colleague' | 'neighbor'

export interface Wish {
    id: string
    created_at: string
    name: string
    email?: string
    phone?: string
    relationship: Relationship
    attending: boolean
    guest_count: number
    message: string
    hearts: number
    is_approved: boolean
    is_pinned: boolean
}

export type WishFormData = Omit<Wish, 'id' | 'created_at' | 'hearts' | 'is_approved' | 'is_pinned'>

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
    family: 'Gia đình',
    friend: 'Bạn bè',
    relative: 'Họ hàng',
    colleague: 'Đồng nghiệp',
    neighbor: 'Hàng xóm',
}

export const RELATIONSHIP_COLORS: Record<Relationship, { bg: string; text: string }> = {
    family: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    friend: { bg: 'bg-rose-100', text: 'text-rose-700' },
    relative: { bg: 'bg-amber-100', text: 'text-amber-700' },
    colleague: { bg: 'bg-teal-100', text: 'text-teal-700' },
    neighbor: { bg: 'bg-neutral-100', text: 'text-neutral-700' },
}
