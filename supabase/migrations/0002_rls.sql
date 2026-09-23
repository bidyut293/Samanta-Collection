-- Row Level Security — section 6 of the implementation plan.

create function is_admin() returns boolean language sql stable security definer as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table profiles enable row level security;
alter table sellers enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_media enable row level security;
alter table price_tiers enable row level security;
alter table size_packs enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table rfqs enable row level security;
alter table rfq_messages enable row level security;
alter table wishlists enable row level security;
alter table tryon_backgrounds enable row level security;
alter table tryon_sessions enable row level security;

-- Profiles: everyone can read, only the owner (or an admin) can write.
create policy "profiles are readable by everyone" on profiles for select using (true);
create policy "users manage their own profile" on profiles for update using (auth.uid() = id or is_admin());

-- Catalog: published rows are public; sellers own their rows; admins bypass everything.
create policy "sellers are readable by everyone" on sellers for select using (true);
create policy "sellers manage their own store" on sellers
  for all using (auth.uid() = id or is_admin()) with check (auth.uid() = id or is_admin());

create policy "categories are readable by everyone" on categories for select using (true);

create policy "published products are readable by everyone" on products
  for select using (status = 'published' or seller_id = auth.uid() or is_admin());
create policy "sellers manage their own products" on products
  for all using (seller_id = auth.uid() or is_admin()) with check (seller_id = auth.uid() or is_admin());

create policy "variants of published products are readable" on product_variants
  for select using (
    exists (select 1 from products p where p.id = product_id and (p.status = 'published' or p.seller_id = auth.uid() or is_admin()))
  );
create policy "sellers manage their own variants" on product_variants
  for all using (
    exists (select 1 from products p where p.id = product_id and (p.seller_id = auth.uid() or is_admin()))
  );

create policy "media of published products are readable" on product_media
  for select using (
    exists (select 1 from products p where p.id = product_id and (p.status = 'published' or p.seller_id = auth.uid() or is_admin()))
  );
create policy "sellers manage their own media" on product_media
  for all using (
    exists (select 1 from products p where p.id = product_id and (p.seller_id = auth.uid() or is_admin()))
  );

create policy "tiers of published products are readable" on price_tiers
  for select using (
    exists (select 1 from products p where p.id = product_id and (p.status = 'published' or p.seller_id = auth.uid() or is_admin()))
  );
create policy "sellers manage their own tiers" on price_tiers
  for all using (
    exists (select 1 from products p where p.id = product_id and (p.seller_id = auth.uid() or is_admin()))
  );

create policy "size packs of published products are readable" on size_packs
  for select using (
    exists (select 1 from products p where p.id = product_id and (p.status = 'published' or p.seller_id = auth.uid() or is_admin()))
  );
create policy "sellers manage their own size packs" on size_packs
  for all using (
    exists (select 1 from products p where p.id = product_id and (p.seller_id = auth.uid() or is_admin()))
  );

-- Buyers: carts, orders, wishlists, RFQs, try-on sessions are private to the owner.
create policy "buyers manage their own cart" on carts
  for all using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid() or is_admin());
create policy "buyers manage their own cart items" on cart_items
  for all using (
    exists (select 1 from carts c where c.id = cart_id and (c.user_id = auth.uid() or is_admin()))
  );

create policy "buyers read their own orders" on orders
  for select using (buyer_id = auth.uid() or is_admin());
create policy "buyers create their own orders" on orders
  for insert with check (buyer_id = auth.uid());

create policy "buyers read their own order items" on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_id and o.buyer_id = auth.uid())
    or seller_id = auth.uid()
    or is_admin()
  );

create policy "buyers manage their own wishlist" on wishlists
  for all using (user_id = auth.uid() or is_admin());

create policy "backgrounds are readable by everyone" on tryon_backgrounds for select using (is_active or is_admin());
create policy "admins manage backgrounds" on tryon_backgrounds for all using (is_admin());

create policy "users manage their own try-on sessions" on tryon_sessions
  for all using (user_id = auth.uid() or is_admin());

-- RFQs: buyer, the product's seller, and admins can see and act on a thread.
create policy "rfq participants can read" on rfqs
  for select using (buyer_id = auth.uid() or seller_id = auth.uid() or is_admin());
create policy "buyers create rfqs" on rfqs
  for insert with check (buyer_id = auth.uid());
create policy "rfq participants can update" on rfqs
  for update using (buyer_id = auth.uid() or seller_id = auth.uid() or is_admin());

create policy "rfq participants can read messages" on rfq_messages
  for select using (
    exists (
      select 1 from rfqs r where r.id = rfq_id
      and (r.buyer_id = auth.uid() or r.seller_id = auth.uid() or is_admin())
    )
  );
create policy "rfq participants can send messages" on rfq_messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from rfqs r where r.id = rfq_id
      and (r.buyer_id = auth.uid() or r.seller_id = auth.uid())
    )
  );

-- Storage buckets (run once in the dashboard or via the storage API):
--   products      public read;  sellers write only to their own folder `seller_id/...`
--   tryon-results private;      each user reads only their own folder `user_id/...`
--   backgrounds   public read;  admins write
