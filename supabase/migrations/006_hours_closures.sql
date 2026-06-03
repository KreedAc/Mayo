-- Weekly hours and special closures stored in site_config

INSERT INTO site_config (key, value) VALUES
  ('weekly_hours', '[
    {"day":"Lunedì","closed":true,"slots":[]},
    {"day":"Martedì","closed":false,"slots":[{"open":"12:30","close":"14:30"},{"open":"18:30","close":"23:30"}]},
    {"day":"Mercoledì","closed":false,"slots":[{"open":"12:30","close":"14:30"},{"open":"18:30","close":"23:30"}]},
    {"day":"Giovedì","closed":false,"slots":[{"open":"12:30","close":"14:30"},{"open":"18:30","close":"23:30"}]},
    {"day":"Venerdì","closed":false,"slots":[{"open":"12:30","close":"14:30"},{"open":"18:30","close":"00:30"}]},
    {"day":"Sabato","closed":false,"slots":[{"open":"18:30","close":"00:30"}]},
    {"day":"Domenica","closed":false,"slots":[{"open":"18:30","close":"23:30"}]}
  ]'),
  ('closures', '[]')
ON CONFLICT (key) DO NOTHING;
