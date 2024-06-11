CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE table_numbers (
    table_number VARCHAR(10) NOT NULL,
    PRIMARY KEY (table_number)
);

CREATE TABLE menuitems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    menu_item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    category VARCHAR(50),
    subtotal DECIMAL(10, 2) NOT NULL,
    comments TEXT,
    table_number VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (table_number) REFERENCES table_numbers(table_number)
);

CREATE TABLE table_order (
    id SERIAL PRIMARY KEY,
    table_number VARCHAR(10) NOT NULL,
    ordered_items TEXT,
    total_quantity INTEGER,
    total_subtotal DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (table_number) REFERENCES table_numbers(table_number)
);
