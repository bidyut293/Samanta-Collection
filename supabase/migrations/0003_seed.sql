-- Minimal seed data — categories and try-on backgrounds only.
-- Products/sellers need a real auth.users row first, so seed those manually
-- (or via the seller dashboard) once you've signed up at least one account.

insert into categories (name, slug) values
  ('Outerwear', 'outerwear'),
  ('Tops', 'tops'),
  ('Bottoms', 'bottoms'),
  ('Dresses', 'dresses'),
  ('Accessories', 'accessories')
on conflict (slug) do nothing;

insert into tryon_backgrounds (name, url, sort) values
  ('Studio White', '/backgrounds/studio.webp', 1),
  ('Beach Golden Hour', '/backgrounds/beach.webp', 2),
  ('Street at Night', '/backgrounds/street-night.webp', 3),
  ('Runway', '/backgrounds/runway.webp', 4);
