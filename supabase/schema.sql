-- ============================================================
-- LIVE WISHES SCHEMA — Wedding Janes & Henry 2026
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- Bảng lưu RSVP + lời chúc
create table if not exists public.wishes (
  id          uuid default gen_random_uuid() primary key,
  created_at  timestamptz default now() not null,

  -- Thông tin khách
  name        text not null,
  email       text,
  phone       text,
  relationship text not null default 'friend',
                -- 'family' | 'friend' | 'relative' | 'colleague' | 'neighbor'

  -- RSVP
  attending   boolean not null default true,
  guest_count integer not null default 1 check (guest_count between 1 and 10),

  -- Lời chúc
  message     text not null,

  -- Moderation: chủ tiệc duyệt trước khi hiển thị (true = hiện, false = ẩn)
  is_approved boolean not null default true,
  -- Đặt default false nếu muốn duyệt thủ công:
  -- is_approved boolean not null default false,

  -- Pin lời chúc yêu thích lên đầu
  is_pinned   boolean not null default false,

  -- Reactions (số tim)
  hearts      integer not null default 0 check (hearts >= 0)
);

-- Index để query nhanh
create index if not exists wishes_created_at_idx on public.wishes (created_at desc);
create index if not exists wishes_approved_idx   on public.wishes (is_approved, created_at desc);
create index if not exists wishes_pinned_idx     on public.wishes (is_pinned desc, created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.wishes enable row level security;

-- Ai cũng đọc được lời chúc đã duyệt
create policy "Public read approved wishes"
  on public.wishes for select
  using (is_approved = true);

-- Ai cũng submit được (có thể thêm rate limiting ở API layer)
create policy "Anyone can insert wishes"
  on public.wishes for insert
  with check (true);

-- Chỉ service_role (admin) mới update/delete
-- (dùng SUPABASE_SERVICE_ROLE_KEY ở server-side)
create policy "Service role can update"
  on public.wishes for update
  using (auth.role() = 'service_role');

create policy "Service role can delete"
  on public.wishes for delete
  using (auth.role() = 'service_role');

-- ============================================================
-- REALTIME: Bật realtime cho bảng wishes
-- ============================================================

-- Thêm bảng vào realtime publication
alter publication supabase_realtime add table public.wishes;

-- ============================================================
-- FUNCTION: Tăng hearts an toàn (tránh race condition)
-- ============================================================

create or replace function increment_hearts(wish_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.wishes
  set hearts = hearts + 1
  where id = wish_id and is_approved = true;
end;
$$;

-- ============================================================
-- SEED DATA: Vài lời chúc mẫu để test
-- ============================================================

insert into public.wishes (name, relationship, attending, guest_count, message, is_pinned, hearts) values
  ('Bố Mẹ Henry', 'family',    true, 2, 'Chúc hai con trăm năm hạnh phúc, vợ chồng hòa thuận, sớm có con cái đầy nhà! Ba mẹ rất vui khi thấy Henry tìm được người bạn đời tốt ❤️', true, 24),
  ('Bố Mẹ Janes', 'family',    true, 2, 'Con gái mẹ xinh đẹp, hiền lành, ba mẹ tin Henry sẽ chăm sóc con thật tốt. Chúc các con hạnh phúc mãi mãi! 🌸', true, 19),
  ('Nhóm bạn KL', 'friend',    true, 4, 'Từ hồi còn cùng nhau khám phá Kuala Lumpur đến nay đã thành hôn rồi! Congrats you two 🎉 Nhớ mời tụi mình tiệc nhé!', false, 12),
  ('Chị Lan Anh',  'colleague', true, 1, 'Chúc mừng Henry và Janes! Làm việc cùng anh mấy năm mới biết anh là người chu đáo thế nào. Janes chọn đúng người rồi 😊', false, 8);
