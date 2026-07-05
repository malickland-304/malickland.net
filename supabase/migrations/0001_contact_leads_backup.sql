-- Durable backup for malickland.net contact-form leads (lead-safety gate,
-- LAUNCH_CHECKLIST.md §B: "No lead silently drops").
--
-- Apply in the Supabase SQL editor (project: malickland-304's Project,
-- ref kwhffzvoflplumrarcbh) or via `supabase db push`. Idempotent.
--
-- Access model: insert-only for the publishable (anon) key. The website can
-- write leads but that key can never read, alter, or delete them. Reading
-- leads requires the Supabase dashboard (or service-role access).

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  received_at timestamptz not null default now(),
  first_name text not null check (char_length(first_name) <= 80),
  last_name text check (char_length(last_name) <= 80),
  email text not null check (char_length(email) <= 254),
  phone text check (char_length(phone) <= 40),
  service_interest text check (char_length(service_interest) <= 120),
  inquiry_type text check (char_length(inquiry_type) <= 80),
  property_type text check (char_length(property_type) <= 80),
  county text check (char_length(county) <= 80),
  budget text check (char_length(budget) <= 80),
  timeline text check (char_length(timeline) <= 80),
  message text not null check (char_length(message) <= 4000),
  preferred_contact text check (char_length(preferred_contact) <= 40),
  attribution jsonb check (pg_column_size(attribution) <= 8192),
  email_delivered boolean not null default false,
  email_error text check (char_length(email_error) <= 500)
);

alter table public.contact_leads enable row level security;

-- Anon/authenticated may INSERT only. No select/update/delete policies exist,
-- so the publishable key cannot read or tamper with stored leads.
drop policy if exists contact_leads_insert_only on public.contact_leads;
create policy contact_leads_insert_only
  on public.contact_leads
  for insert
  to anon, authenticated
  with check (true);

revoke all on public.contact_leads from anon, authenticated;
grant insert on public.contact_leads to anon, authenticated;

-- Rollback (if the backup store is retired):
--   drop table if exists public.contact_leads;
