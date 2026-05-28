-- Aggiunge la colonna allergens alla tabella products
alter table products
  add column if not exists allergens text[] not null default '{}';
