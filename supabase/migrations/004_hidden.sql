-- Aggiunge il campo hidden ai prodotti (default visibile)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;
