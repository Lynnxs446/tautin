create extension if not exists "uuid-ossp";

create table if not exists public.settings (
  key   text primary key,
  value text
);

insert into public.settings (key, value) values
  ('brand_name',        'Brand Name'),
  ('brand_name_color',  '#FFFFFF'),
  ('tagline',           'Your tagline here'),
  ('tagline_color',     '#A3A3A3'),
  ('footer_text',       '© 2025 Brand Name. All rights reserved.'),
  ('footer_color',      '#737373'),
  ('page_bg_type',      'color'),
  ('page_bg_value',     '#0D0D0D'),
  ('card_bg_type',      'color'),
  ('card_bg_value',     '#1E1E1E'),
  ('btn_bg_type',       'color'),
  ('btn_bg_value',      '#2A2A2A'),
  ('btn_text_color',    '#FFFFFF'),
  ('logo_url',          '')
on conflict (key) do nothing;

create table if not exists public.links (
  id          uuid primary key default uuid_generate_v4(),
  label       text not null,
  url         text not null,
  icon        text not null default 'LinkIcon',
  order_index integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.links (label, url, icon, order_index) values
  ('Instagram', 'https://instagram.com', 'Instagram',  0),
  ('TikTok',    'https://tiktok.com',    'TikTok',     1),
  ('Shopee',    'https://shopee.co.id',  'Shopee',     2),
  ('WhatsApp',  'https://wa.me/628123456789', 'WhatsApp', 3)
on conflict do nothing;

alter table public.settings enable row level security;
alter table public.links    enable row level security;

create policy "Public read settings"
  on public.settings for select
  using (true);

create policy "Public read links"
  on public.links for select
  using (true);

create policy "Authenticated write settings"
  on public.settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated write links"
  on public.links for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public media read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated media write"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "Authenticated media delete"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "Authenticated media update"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');
