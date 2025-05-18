-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default",
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    role character varying(20) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role::text = ANY (ARRAY['customer'::character varying, 'owner'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;



-- Table: public.restaurants

-- DROP TABLE IF EXISTS public.restaurants;

CREATE TABLE IF NOT EXISTS public.restaurants
(
    restaurant_id integer NOT NULL DEFAULT nextval('restaurants_restaurant_id_seq'::regclass),
    owner_id integer,
    have_branches boolean,
    name character varying(100) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    address text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    CONSTRAINT restaurants_pkey PRIMARY KEY (restaurant_id),
    CONSTRAINT restaurants_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.restaurants
    OWNER to postgres;

-- Table: public.orders

-- DROP TABLE IF EXISTS public.orders;

CREATE TABLE IF NOT EXISTS public.orders
(
    order_id integer NOT NULL DEFAULT nextval('orders_order_id_seq'::regclass),
    customer_id integer,
    total_amount numeric(10,2),
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    qr_code_uuid uuid DEFAULT gen_random_uuid(),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id),
    CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.orders
    OWNER to postgres;


-- Table: public.order_items

-- DROP TABLE IF EXISTS public.order_items;

CREATE TABLE IF NOT EXISTS public.order_items
(
    order_item_id integer NOT NULL DEFAULT nextval('order_items_order_item_id_seq'::regclass),
    order_id integer,
    item_id integer,
    quantity integer,
    price numeric(10,2),
    CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id),
    CONSTRAINT order_items_item_id_fkey FOREIGN KEY (item_id)
        REFERENCES public.menu_items (item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id)
        REFERENCES public.orders (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.order_items
    OWNER to postgres;


-- Table: public.menu_items

-- DROP TABLE IF EXISTS public.menu_items;

CREATE TABLE IF NOT EXISTS public.menu_items
(
    item_id integer NOT NULL DEFAULT nextval('menu_items_item_id_seq'::regclass),
    branch_id integer,
    restaurant_id integer,
    name character varying(100) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    price numeric(10,2),
    available boolean DEFAULT true,
    pieces_left character varying(3) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT menu_items_pkey PRIMARY KEY (item_id),
    CONSTRAINT menu_items_branch_id_fkey FOREIGN KEY (branch_id)
        REFERENCES public.branches (branch_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT menu_items_restaurant_id_fkey FOREIGN KEY (restaurant_id)
        REFERENCES public.restaurants (restaurant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT menu_items_check CHECK (branch_id IS NOT NULL OR restaurant_id IS NOT NULL)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.menu_items
    OWNER to postgres;


-- Table: public.carts

-- DROP TABLE IF EXISTS public.carts;

CREATE TABLE IF NOT EXISTS public.carts
(
    cart_id integer NOT NULL DEFAULT nextval('carts_cart_id_seq'::regclass),
    customer_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT carts_pkey PRIMARY KEY (cart_id),
    CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.carts
    OWNER to postgres;


-- Table: public.cart_items

-- DROP TABLE IF EXISTS public.cart_items;

CREATE TABLE IF NOT EXISTS public.cart_items
(
    cart_item_id integer NOT NULL DEFAULT nextval('cart_items_cart_item_id_seq'::regclass),
    cart_id integer,
    item_id integer,
    quantity integer DEFAULT 1,
    price integer,
    CONSTRAINT cart_items_pkey PRIMARY KEY (cart_item_id),
    CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id)
        REFERENCES public.carts (cart_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT cart_items_item_id_fkey FOREIGN KEY (item_id)
        REFERENCES public.menu_items (item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.cart_items
    OWNER to postgres;


-- Table: public.branches

-- DROP TABLE IF EXISTS public.branches;

CREATE TABLE IF NOT EXISTS public.branches
(
    branch_id integer NOT NULL DEFAULT nextval('branches_branch_id_seq'::regclass),
    restaurant_id integer,
    address text COLLATE pg_catalog."default",
    city character varying(100) COLLATE pg_catalog."default",
    state character varying(100) COLLATE pg_catalog."default",
    pincode character varying(10) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT branches_pkey PRIMARY KEY (branch_id),
    CONSTRAINT branches_restaurant_id_fkey FOREIGN KEY (restaurant_id)
        REFERENCES public.restaurants (restaurant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.branches
    OWNER to postgres;





    