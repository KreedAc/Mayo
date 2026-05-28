-- Categorie del menu (ordine di visualizzazione)
create table categories (
  id          text primary key,
  label       text not null,
  emoji       text,
  blurb       text,
  sort_order  int not null default 0
);

-- Prodotti
create table products (
  id          uuid primary key default gen_random_uuid(),
  category_id text not null references categories(id) on delete restrict,
  name        text not null,
  description text default '',
  image_url   text,
  price       numeric(6,2),
  featured    boolean not null default false,
  badges      text[] not null default '{}',
  sort_order  int not null default 0,
  created_at  timestamptz default now()
);

-- Varianti
create table product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  label       text not null,
  price       numeric(6,2) not null,
  sort_order  int not null default 0
);

-- Ordini (opzionale — storico oltre a WhatsApp)
create table orders (
  id          uuid primary key default gen_random_uuid(),
  customer    text not null,
  items       jsonb not null,
  total       numeric(7,2) not null,
  channel     text default 'whatsapp',
  created_at  timestamptz default now()
);

-- RLS: lettura pubblica, scrittura solo admin autenticato
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read products"   on products   for select using (true);
create policy "public read variants"   on product_variants for select using (true);

create policy "admin write categories" on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin write products" on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin write variants" on product_variants for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- GRANT espliciti (richiesti da Supabase dal 30 maggio 2026 per nuovi progetti)
grant usage on schema public to anon, authenticated;

-- anon: solo lettura del menu (nessuna autenticazione richiesta)
grant select on categories       to anon;
grant select on products         to anon;
grant select on product_variants to anon;

-- authenticated: lettura + scrittura completa (admin)
grant all on categories       to authenticated;
grant all on products         to authenticated;
grant all on product_variants to authenticated;
grant all on orders           to authenticated;
