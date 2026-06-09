-- RLS mancante sulla tabella orders (solo admin autenticato può accedervi)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin all orders" ON orders FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- GRANT espliciti per site_config (richiesti da Supabase dal 30 maggio 2026,
-- allineati a quelli di 001_schema.sql)
GRANT SELECT ON site_config TO anon;
GRANT ALL ON site_config TO authenticated;
