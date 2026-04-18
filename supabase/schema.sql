-- supabase/schema.sql
-- Run this in the Supabase SQL Editor

-- 1. Create the 'wishes' table
CREATE TABLE IF NOT EXISTS public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  relationship TEXT NOT NULL,
  attending BOOLEAN DEFAULT true NOT NULL,
  guest_count INT DEFAULT 1 NOT NULL,
  message TEXT NOT NULL,
  hearts INT DEFAULT 0 NOT NULL,
  is_approved BOOLEAN DEFAULT false NOT NULL,
  is_pinned BOOLEAN DEFAULT false NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Policy: Anyone can read approved wishes
CREATE POLICY "Allow public read-only access for approved wishes"
ON public.wishes FOR SELECT
USING (is_approved = true);

-- Policy: Anyone can insert a new wish
CREATE POLICY "Allow public insert"
ON public.wishes FOR INSERT
WITH CHECK (true);

-- policy for admin to have full access (based on service_role) is default

-- 4. Enable Realtime
-- Step 1: Add the table to the 'supabase_realtime' publication
-- If you haven't enabled realtime for any table yet, you might need to create the publication first,
-- but typically Supabase projects have it.
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;

-- 5. Create the increment_hearts function (RPC)
-- This allows incrementing hearts without giving update permission to the entire row
CREATE OR REPLACE FUNCTION public.increment_hearts(wish_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with the privileges of the creator (admin)
AS $$
BEGIN
  UPDATE public.wishes
  SET hearts = hearts + 1
  WHERE id = wish_id;
END;
$$;

-- 6. Insert seed data (Optional/Testing)
-- INSERT INTO public.wishes (name, relationship, message, attending, guest_count)
-- VALUES ('Văn A', 'friend', 'Chúc hai bạn mãi hạnh phúc! 🎉', true, 2);
