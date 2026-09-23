-- Drape schema — section 6 of the implementation plan.
-- Seventeen tables covering users, sellers, catalog, wholesale, orders, RFQs and try-on analytics.

create type user_role as enum ('buyer', 'seller', 'admin');
create type order_status as enum ('pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled');
create type order_type as enum ('retail', 'wholesale');
create type rfq_status as enum ('open', 'quoted', 'accepted', 'rejected', 'closed');
create type garment_category as enum ('top', 'bottom', 'dress', 'outerwear', 'cap', 'eyewear', 'footwear', 'other');

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'buyer',
  is_business boolean default false,
  gstin text,
  business_verified boolean default false,
  created_at timestamptz default now()
);

create table sellers (
  id uuid primary key references profiles(id) on delete cascade,
  store_name text not null,
  slug text unique not null,
  bio text,
  logo_url text,
  approved boolean default false,
  created_at timestamptz default now()
);

create table categories (
  id serial primary key,
  name text not null,
  slug text unique not null,
  parent_id int references categories(id)
);

create table products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references sellers(id) on delete cascade,
  category_id int references categories(id),
  title text not null,
  slug text unique not null,
  description text,
  fabric text,
  gender text,
  garment_type garment_category not null,
  base_price numeric(10, 2) not null,
  wholesale_enabled boolean default false,
  moq int default 1,
  tryon_enabled boolean default true,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  color text not null,
  sku text unique,
  stock int default 0,
  price_override numeric(10, 2)
);

create table product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  position int default 0,
  is_tryon_reference boolean default false, -- clean, background-removed image
  overlay_url text                          -- transparent PNG for AR overlay
);

create table price_tiers (
  id serial primary key,
  product_id uuid not null references products(id) on delete cascade,
  min_qty int not null,
  unit_price numeric(10, 2) not null
);

create table size_packs (
  id serial primary key,
  product_id uuid not null references products(id) on delete cascade,
  name text,
  ratio jsonb not null -- {"S":1,"M":2,"L":2,"XL":1}
);

create table carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references profiles(id) on delete cascade
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references carts(id) on delete cascade,
  variant_id uuid references product_variants(id),
  qty int not null check (qty > 0)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references profiles(id),
  type order_type default 'retail',
  status order_status default 'pending',
  subtotal numeric(12, 2),
  shipping numeric(10, 2) default 0,
  total numeric(12, 2),
  shipping_address jsonb,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  seller_id uuid references sellers(id),
  variant_id uuid references product_variants(id),
  qty int,
  unit_price numeric(10, 2)
);

create table rfqs (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references profiles(id),
  product_id uuid references products(id),
  seller_id uuid references sellers(id),
  qty int not null,
  target_price numeric(10, 2),
  notes text,
  status rfq_status default 'open',
  quoted_price numeric(10, 2),
  created_at timestamptz default now()
);

create table rfq_messages (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid references rfqs(id) on delete cascade,
  sender_id uuid references profiles(id),
  body text,
  created_at timestamptz default now()
);

create table wishlists (
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  primary key (user_id, product_id)
);

create table tryon_backgrounds (
  id serial primary key,
  name text,
  url text,
  is_active boolean default true,
  sort int
);

create table tryon_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  mode text check (mode in ('ar_live', 'ai_snapshot')),
  seconds_live int default 0,
  result_url text,
  added_to_cart boolean default false,
  created_at timestamptz default now()
);

-- auto-create profile on signup
create function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();
