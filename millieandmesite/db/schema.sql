-- Millie & Me rental booking schema
-- Run this once against your Netlify DB (Postgres) instance.

create extension if not exists "pgcrypto";

create table if not exists items (
  id text primary key,                 -- slug, e.g. 'doona-infant-car-seat-latch-base-rental'
  name text not null,
  description text,
  image_url text,
  quantity integer not null default 1, -- how many units of this item exist to rent
  pricing_tiers jsonb not null,        -- [{"label":"1 Day","days":1,"price_cents":800}, ...]
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  item_id text not null references items(id),
  start_date date not null,
  end_date date not null,              -- inclusive
  tier_label text not null,
  price_cents integer not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status text not null default 'pending', -- pending | confirmed | cancelled | blocked
  stripe_session_id text,
  created_at timestamptz not null default now(),
  constraint valid_dates check (end_date >= start_date)
);

create index if not exists idx_bookings_item_dates on bookings (item_id, start_date, end_date) where status in ('pending','confirmed','blocked');

-- Simple admin-created "blocked" rows use the same table with status='blocked' and a placeholder customer.
