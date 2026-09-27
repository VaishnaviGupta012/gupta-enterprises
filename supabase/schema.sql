-- ====================================================================
-- Gupta Enterprises CSC - Database Schema for Supabase
-- Tables: enquiries, chat_queries
-- Row Level Security (RLS) configured for public submission & admin access
-- ====================================================================

-- 1. ENQUIRIES TABLE
create table if not exists public.enquiries (
  id uuid default gen_random_uuid() primary key,
  reference_id text unique not null,
  name text not null,
  phone text not null,
  whatsapp_number text,
  email text,
  service text not null,
  message text not null,
  status text not null default 'New' check (status in ('New', 'Contacted', 'In Progress', 'Completed')),
  created_at timestamptz default now() not null
);

-- Index for fast status filtering and chronological sorting
create index if not exists idx_enquiries_status on public.enquiries(status);
create index if not exists idx_enquiries_created_at on public.enquiries(created_at desc);
create index if not exists idx_enquiries_reference_id on public.enquiries(reference_id);

-- 2. CHAT QUERIES TABLE (Anonymous session storage)
create table if not exists public.chat_queries (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  user_message text not null,
  ai_response text not null,
  detected_service text,
  created_at timestamptz default now() not null
);

-- Index for chronological sorting and session lookup
create index if not exists idx_chat_queries_created_at on public.chat_queries(created_at desc);
create index if not exists idx_chat_queries_session_id on public.chat_queries(session_id);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.enquiries enable row level security;
alter table public.chat_queries enable row level security;

-- ====================================================================
-- 4. ROW LEVEL SECURITY POLICIES
-- ====================================================================

-- ENQUIRIES POLICIES:
-- A. Allow anyone to submit enquiries (public insert)
drop policy if exists "Public users can insert enquiries" on public.enquiries;
create policy "Public users can insert enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

-- B. Allow reading enquiries for admin dashboard
drop policy if exists "Admins can view and manage enquiries" on public.enquiries;
drop policy if exists "Allow select enquiries" on public.enquiries;
create policy "Allow select enquiries"
  on public.enquiries
  for select
  to anon, authenticated
  using (true);

-- C. Allow updating enquiry status (e.g. New -> Contacted -> Completed)
drop policy if exists "Allow update enquiries" on public.enquiries;
create policy "Allow update enquiries"
  on public.enquiries
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- CHAT QUERIES POLICIES:
-- A. Allow logging chatbot queries
drop policy if exists "Public users can insert chat queries" on public.chat_queries;
create policy "Public users can insert chat queries"
  on public.chat_queries
  for insert
  to anon, authenticated
  with check (true);

-- B. Allow viewing chatbot query history in admin dashboard
drop policy if exists "Admins can view chat queries" on public.chat_queries;
drop policy if exists "Allow select chat_queries" on public.chat_queries;
create policy "Allow select chat_queries"
  on public.chat_queries
  for select
  to anon, authenticated
  using (true);

-- C. Allow deleting chat queries
drop policy if exists "Admins can delete chat queries" on public.chat_queries;
create policy "Admins can delete chat queries"
  on public.chat_queries
  for delete
  to authenticated
  using (true);
