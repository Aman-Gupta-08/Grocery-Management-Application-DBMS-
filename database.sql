-- ============================================================
-- GROCERY MANAGEMENT SYSTEM - Complete MySQL Database Script
-- DBMS Capstone Project | Normalized to 3NF
-- ============================================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS grocery_management;
USE grocery_management;

-- ============================================================
-- DROP TABLES (in reverse dependency order for clean re-run)
-- ============================================================
DROP TABLE IF EXISTS inventory_log;
DROP TABLE IF EXISTS delivery;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_details;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS customers;

-- ============================================================
-- TABLE: customers
-- ============================================================
CREATE TABLE customers (
    customer_id   INT          AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    phone         VARCHAR(15)  NOT NULL,
    address       TEXT         NOT NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_customer_email CHECK (email LIKE '%@%.%'),
    CONSTRAINT chk_customer_phone CHECK (LENGTH(phone) >= 7)
);

-- ============================================================
-- TABLE: suppliers
-- ============================================================
CREATE TABLE suppliers (
    supplier_id   INT          AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_no    VARCHAR(15)  NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    address       TEXT         NOT NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_supplier_email CHECK (email LIKE '%@%.%')
);

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE products (
    product_id     INT            AUTO_INCREMENT PRIMARY KEY,
    supplier_id    INT            NOT NULL,
    product_name   VARCHAR(150)   NOT NULL,
    category       VARCHAR(80)    NOT NULL,
    price          DECIMAL(10,2)  NOT NULL,
    stock_quantity INT            NOT NULL DEFAULT 0,
    expiry_date    DATE,
    created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_price          CHECK (price >= 0),
    CONSTRAINT chk_stock          CHECK (stock_quantity >= 0)
);

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE orders (
    order_id     INT            AUTO_INCREMENT PRIMARY KEY,
    customer_id  INT            NOT NULL,
    order_date   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
    order_status ENUM('Pending','Processing','Shipped','Delivered','Cancelled') NOT NULL DEFAULT 'Pending',
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_total_amount CHECK (total_amount >= 0)
);

-- ============================================================
-- TABLE: order_details
-- ============================================================
CREATE TABLE order_details (
    order_detail_id INT           AUTO_INCREMENT PRIMARY KEY,
    order_id        INT           NOT NULL,
    product_id      INT           NOT NULL,
    quantity        INT           NOT NULL,
    subtotal        DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_od_order   FOREIGN KEY (order_id)   REFERENCES orders(order_id)   ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_od_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_quantity  CHECK (quantity > 0),
    CONSTRAINT chk_subtotal  CHECK (subtotal >= 0)
);

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE payments (
    payment_id     INT            AUTO_INCREMENT PRIMARY KEY,
    order_id       INT            NOT NULL UNIQUE,
    payment_method ENUM('Cash','Credit Card','Debit Card','UPI','Net Banking','Wallet') NOT NULL,
    payment_status ENUM('Pending','Completed','Failed','Refunded') NOT NULL DEFAULT 'Pending',
    amount         DECIMAL(12,2)  NOT NULL,
    payment_date   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_payment_amount CHECK (amount >= 0)
);

-- ============================================================
-- TABLE: delivery
-- ============================================================
CREATE TABLE delivery (
    delivery_id      INT  AUTO_INCREMENT PRIMARY KEY,
    order_id         INT  NOT NULL UNIQUE,
    delivery_status  ENUM('Pending','Dispatched','In Transit','Delivered','Failed') NOT NULL DEFAULT 'Pending',
    delivery_date    DATE,
    delivery_address TEXT NOT NULL,
    CONSTRAINT fk_delivery_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ============================================================
-- TABLE: inventory_log
-- ============================================================
CREATE TABLE inventory_log (
    log_id           INT       AUTO_INCREMENT PRIMARY KEY,
    product_id       INT       NOT NULL,
    stock_in         INT       NOT NULL DEFAULT 0,
    stock_out        INT       NOT NULL DEFAULT 0,
    transaction_date DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes            VARCHAR(255),
    CONSTRAINT fk_log_product  FOREIGN KEY (product_id) REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_stock_in    CHECK (stock_in  >= 0),
    CONSTRAINT chk_stock_out   CHECK (stock_out >= 0)
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_products_category   ON products(category);
CREATE INDEX idx_products_supplier   ON products(supplier_id);
CREATE INDEX idx_orders_customer     ON orders(customer_id);
CREATE INDEX idx_orders_status       ON orders(order_status);
CREATE INDEX idx_orders_date         ON orders(order_date);
CREATE INDEX idx_od_order            ON order_details(order_id);
CREATE INDEX idx_od_product          ON order_details(product_id);
CREATE INDEX idx_payments_status     ON payments(payment_status);
CREATE INDEX idx_delivery_status     ON delivery(delivery_status);
CREATE INDEX idx_inventory_product   ON inventory_log(product_id);
CREATE INDEX idx_inventory_date      ON inventory_log(transaction_date);

-- ============================================================
-- SAMPLE DATA: 20 Customers
-- ============================================================
INSERT INTO customers (customer_name, email, phone, address) VALUES
('Aarav Sharma',    'aarav.sharma@gmail.com',    '9876543210', '12, MG Road, Bangalore, Karnataka 560001'),
('Priya Patel',     'priya.patel@yahoo.com',     '9812345678', '45, Anna Nagar, Chennai, Tamil Nadu 600040'),
('Rohit Verma',     'rohit.verma@outlook.com',   '9923456789', '78, Connaught Place, New Delhi 110001'),
('Sneha Iyer',      'sneha.iyer@gmail.com',      '9734567890', '23, Koregaon Park, Pune, Maharashtra 411001'),
('Karan Mehta',     'karan.mehta@gmail.com',     '9645678901', '56, Salt Lake, Kolkata, West Bengal 700091'),
('Anjali Singh',    'anjali.singh@rediffmail.com','9556789012', '89, Banjara Hills, Hyderabad, Telangana 500034'),
('Vikram Nair',     'vikram.nair@gmail.com',      '9467890123', '34, Marine Drive, Mumbai, Maharashtra 400020'),
('Divya Reddy',     'divya.reddy@gmail.com',      '9378901234', '67, Jubilee Hills, Hyderabad, Telangana 500033'),
('Amit Kumar',      'amit.kumar@hotmail.com',     '9289012345', '11, Civil Lines, Jaipur, Rajasthan 302006'),
('Pooja Gupta',     'pooja.gupta@gmail.com',      '9190123456', '44, Aliganj, Lucknow, Uttar Pradesh 226024'),
('Rahul Joshi',     'rahul.joshi@gmail.com',      '9901234567', '77, Navrangpura, Ahmedabad, Gujarat 380009'),
('Meera Krishnan',  'meera.krishnan@gmail.com',   '9812340987', '22, T Nagar, Chennai, Tamil Nadu 600017'),
('Suresh Pillai',   'suresh.pillai@yahoo.com',    '9723451098', '55, Thrissur, Kerala 680001'),
('Neha Agarwal',    'neha.agarwal@gmail.com',     '9634562109', '88, Sector 17, Chandigarh 160017'),
('Arjun Bose',      'arjun.bose@gmail.com',       '9545673210', '33, Park Street, Kolkata, West Bengal 700016'),
('Lakshmi Rao',     'lakshmi.rao@gmail.com',      '9456784321', '66, Indiranagar, Bangalore, Karnataka 560038'),
('Sanjay Tiwari',   'sanjay.tiwari@outlook.com',  '9367895432', '99, Hazratganj, Lucknow, Uttar Pradesh 226001'),
('Ritu Malhotra',   'ritu.malhotra@gmail.com',    '9278906543', '12, Model Town, Delhi 110009'),
('Deepak Jain',     'deepak.jain@gmail.com',      '9189017654', '45, Vastrapur, Ahmedabad, Gujarat 380015'),
('Kavya Menon',     'kavya.menon@gmail.com',      '9090128765', '78, Kakkanad, Kochi, Kerala 682030');

-- ============================================================
-- SAMPLE DATA: 20 Suppliers
-- ============================================================
INSERT INTO suppliers (supplier_name, contact_no, email, address) VALUES
('FreshFarm Agro Pvt Ltd',      '8012345678', 'contact@freshfarm.com',      'Industrial Area, Pune, Maharashtra 411019'),
('Nature\'s Basket Supplies',   '8123456789', 'supply@naturesbasket.in',    'Sector 5, Noida, Uttar Pradesh 201301'),
('Green Valley Organics',       '8234567890', 'info@greenvalley.co.in',     'Mysore Road, Bangalore, Karnataka 560026'),
('Prime Foods Distribution',    '8345678901', 'orders@primefoods.com',      'Guindy, Chennai, Tamil Nadu 600032'),
('Sunrise Dairy Products',      '8456789012', 'sales@sunrisedairy.in',      'Anand, Gujarat 388001'),
('Golden Grain Traders',        '8567890123', 'trade@goldengrain.com',      'Mandi Gobindgarh, Punjab 147301'),
('Tropical Fruits Co.',         '8678901234', 'export@tropicalfruits.in',   'Ratnagiri, Maharashtra 415612'),
('Ocean Fresh Seafood',         '8789012345', 'fresh@oceanseafood.com',     'Kochi Port, Kerala 682009'),
('Himalayan Spice Hub',         '8890123456', 'spice@himalayanspice.in',    'Cochin, Kerala 682001'),
('Farm to Fork Logistics',      '8901234567', 'logistics@farmtofork.com',   'Bommasandra, Bangalore 560099'),
('Royal Bakery Supplies',       '9012345678', 'royal@bakerysupplies.in',    'Bandra, Mumbai, Maharashtra 400050'),
('NutriPack Foods',             '9123456789', 'info@nutripack.co.in',       'Okhla Industrial, Delhi 110020'),
('South India Grocers',         '9234567890', 'south@indiagrocers.com',     'Coimbatore, Tamil Nadu 641001'),
('Bengal Rice Traders',         '9345678901', 'rice@bengaltrade.in',        'Burdwan, West Bengal 713101'),
('Western Fresh Produce',       '9456789012', 'fresh@westernproduce.com',   'Nashik, Maharashtra 422001'),
('Desi Organic Farms',          '9567890123', 'desi@organicfarms.in',       'Jodhpur, Rajasthan 342001'),
('Pure Honey Collective',       '9678901234', 'honey@purecollective.com',   'Coorg, Karnataka 571201'),
('Mountain Herbs & Spices',     '9789012345', 'herbs@mountainspice.in',     'Dehradun, Uttarakhand 248001'),
('City Cold Storage Co.',       '9890123456', 'cold@citystorage.com',       'Turbhe, Navi Mumbai 400705'),
('Pan India Food Distributors', '9901234560', 'pan@indiafood.co.in',        'Dharuhera, Haryana 123106');

-- ============================================================
-- SAMPLE DATA: 30 Products
-- ============================================================
INSERT INTO products (supplier_id, product_name, category, price, stock_quantity, expiry_date) VALUES
(1,  'Organic Basmati Rice (5kg)',    'Grains & Cereals', 450.00,  120, '2026-12-31'),
(6,  'Whole Wheat Atta (10kg)',       'Grains & Cereals', 380.00,   90, '2026-09-30'),
(6,  'Yellow Moong Dal (1kg)',        'Pulses',           95.00,   200, '2026-11-30'),
(14, 'Toor Dal (1kg)',                'Pulses',           110.00,  180, '2026-11-30'),
(5,  'Full Cream Milk (1L)',          'Dairy',            62.00,   300, '2026-06-25'),
(5,  'Amul Butter (500g)',            'Dairy',            275.00,  150, '2026-08-31'),
(5,  'Paneer Fresh (200g)',           'Dairy',            85.00,   100, '2026-06-22'),
(7,  'Alphonso Mangoes (1kg)',        'Fruits',           250.00,   80, '2026-06-30'),
(7,  'Bananas (1 dozen)',             'Fruits',           45.00,   250, '2026-06-20'),
(3,  'Fresh Spinach (500g)',          'Vegetables',       30.00,   200, '2026-06-19'),
(3,  'Tomatoes (1kg)',                'Vegetables',       40.00,   320, '2026-06-21'),
(3,  'Onions (2kg)',                  'Vegetables',       55.00,   400, '2026-08-30'),
(9,  'Red Chilli Powder (200g)',      'Spices',           60.00,   160, '2027-06-30'),
(9,  'Turmeric Powder (200g)',        'Spices',           45.00,   180, '2027-06-30'),
(9,  'Garam Masala (100g)',           'Spices',           55.00,   140, '2027-03-31'),
(11, 'Whole Grain Bread (400g)',      'Bakery',           55.00,   120, '2026-06-22'),
(11, 'Multigrain Cookies (200g)',     'Bakery',           90.00,    80, '2026-12-31'),
(2,  'Cold Pressed Coconut Oil (1L)', 'Oils & Fats',      320.00,   70, '2027-01-31'),
(2,  'Sunflower Oil (1L)',            'Oils & Fats',      145.00,  110, '2027-01-31'),
(12, 'Tomato Ketchup (500g)',         'Condiments',       85.00,   130, '2027-06-30'),
(12, 'Mango Pickle (500g)',           'Condiments',       95.00,   100, '2027-06-30'),
(17, 'Wild Forest Honey (500g)',      'Health Foods',     350.00,   60, '2028-01-01'),
(3,  'Aloe Vera Juice (1L)',          'Health Foods',     199.00,   50, '2027-03-31'),
(8,  'Rohu Fish (1kg)',               'Seafood',          220.00,   40, '2026-06-18'),
(8,  'Prawns Medium (500g)',          'Seafood',          350.00,   35, '2026-06-18'),
(16, 'Mixed Dry Fruits (500g)',       'Snacks',           650.00,   55, '2027-06-30'),
(16, 'Roasted Peanuts (500g)',        'Snacks',           120.00,  160, '2026-12-31'),
(13, 'Idli Rice (5kg)',               'Grains & Cereals', 310.00,  100, '2026-12-31'),
(4,  'Green Tea Bags (25 bags)',      'Beverages',        180.00,   90, '2027-12-31'),
(4,  'Filter Coffee Powder (500g)',   'Beverages',        240.00,  110, '2027-06-30');

-- ============================================================
-- SAMPLE DATA: 15 Orders
-- ============================================================
INSERT INTO orders (customer_id, order_date, total_amount, order_status) VALUES
(1,  '2026-05-01 10:30:00', 1345.00, 'Delivered'),
(3,  '2026-05-03 11:15:00',  775.00, 'Delivered'),
(5,  '2026-05-05 14:00:00', 1220.00, 'Delivered'),
(7,  '2026-05-07 09:45:00',  590.00, 'Delivered'),
(2,  '2026-05-10 16:20:00',  870.00, 'Shipped'),
(4,  '2026-05-12 13:00:00', 1560.00, 'Shipped'),
(6,  '2026-05-15 10:00:00',  430.00, 'Processing'),
(8,  '2026-05-17 15:30:00', 2100.00, 'Processing'),
(10, '2026-05-20 11:00:00',  685.00, 'Pending'),
(12, '2026-05-22 12:45:00', 1125.00, 'Delivered'),
(14, '2026-05-25 09:30:00',  960.00, 'Delivered'),
(16, '2026-05-28 14:15:00',  755.00, 'Shipped'),
(18, '2026-06-01 10:00:00', 1440.00, 'Delivered'),
(20, '2026-06-05 11:30:00',  820.00, 'Processing'),
(9,  '2026-06-10 13:00:00',  570.00, 'Pending');

-- ============================================================
-- SAMPLE DATA: 25 Order Details
-- ============================================================
INSERT INTO order_details (order_id, product_id, quantity, subtotal) VALUES
(1,  1,  2, 900.00),
(1,  5,  3, 186.00),
(1, 11,  3, 120.00),
(1, 13,  1,  60.00),
(2,  2,  2, 760.00),
(2,  9,  1,  45.00),  -- corrected to match more realistic
(3,  6,  2, 550.00),
(3, 18,  2, 640.00),  -- oil
(3,  8,  1, 250.00),
(4,  5,  4, 248.00),
(4, 16,  1,  55.00),
(4, 20,  2, 170.00),
(4, 29,  1, 180.00),
(5,  3,  4, 380.00),
(5, 14,  3, 135.00),
(5, 22,  1, 350.00),
(6, 26,  1, 650.00),
(6,  7,  4, 340.00),
(6, 19,  4, 580.00),
(7, 10,  5, 150.00),
(7, 11,  2,  80.00),
(8,  8,  3, 750.00),
(8, 24,  3, 660.00),
(8, 25,  2, 700.00),
(9, 27,  5, 600.00);

-- ============================================================
-- SAMPLE DATA: 15 Payments
-- ============================================================
INSERT INTO payments (order_id, payment_method, payment_status, amount, payment_date) VALUES
(1,  'UPI',          'Completed', 1345.00, '2026-05-01 10:35:00'),
(2,  'Credit Card',  'Completed',  775.00, '2026-05-03 11:20:00'),
(3,  'Net Banking',  'Completed', 1220.00, '2026-05-05 14:05:00'),
(4,  'Cash',         'Completed',  590.00, '2026-05-07 09:50:00'),
(5,  'Debit Card',   'Completed',  870.00, '2026-05-10 16:25:00'),
(6,  'UPI',          'Completed', 1560.00, '2026-05-12 13:05:00'),
(7,  'Wallet',       'Pending',    430.00, '2026-05-15 10:05:00'),
(8,  'Credit Card',  'Completed', 2100.00, '2026-05-17 15:35:00'),
(9,  'UPI',          'Pending',    685.00, '2026-05-20 11:05:00'),
(10, 'Net Banking',  'Completed', 1125.00, '2026-05-22 12:50:00'),
(11, 'Cash',         'Completed',  960.00, '2026-05-25 09:35:00'),
(12, 'Debit Card',   'Completed',  755.00, '2026-05-28 14:20:00'),
(13, 'UPI',          'Completed', 1440.00, '2026-06-01 10:05:00'),
(14, 'Credit Card',  'Pending',    820.00, '2026-06-05 11:35:00'),
(15, 'Cash',         'Pending',    570.00, '2026-06-10 13:05:00');

-- ============================================================
-- SAMPLE DATA: 15 Deliveries
-- ============================================================
INSERT INTO delivery (order_id, delivery_status, delivery_date, delivery_address) VALUES
(1,  'Delivered',  '2026-05-03', '12, MG Road, Bangalore, Karnataka 560001'),
(2,  'Delivered',  '2026-05-05', '78, Connaught Place, New Delhi 110001'),
(3,  'Delivered',  '2026-05-07', '56, Salt Lake, Kolkata, West Bengal 700091'),
(4,  'Delivered',  '2026-05-09', '34, Marine Drive, Mumbai, Maharashtra 400020'),
(5,  'In Transit', '2026-06-19', '45, Anna Nagar, Chennai, Tamil Nadu 600040'),
(6,  'Dispatched', '2026-06-20', '23, Koregaon Park, Pune, Maharashtra 411001'),
(7,  'Pending',     NULL,        '89, Banjara Hills, Hyderabad, Telangana 500034'),
(8,  'In Transit', '2026-06-19', '67, Jubilee Hills, Hyderabad, Telangana 500033'),
(9,  'Pending',     NULL,        '44, Aliganj, Lucknow, Uttar Pradesh 226024'),
(10, 'Delivered',  '2026-05-24', '22, T Nagar, Chennai, Tamil Nadu 600017'),
(11, 'Delivered',  '2026-05-27', '88, Sector 17, Chandigarh 160017'),
(12, 'Dispatched', '2026-06-20', '66, Indiranagar, Bangalore, Karnataka 560038'),
(13, 'Delivered',  '2026-06-03', '12, Model Town, Delhi 110009'),
(14, 'Pending',     NULL,        '78, Kakkanad, Kochi, Kerala 682030'),
(15, 'Pending',     NULL,        '11, Civil Lines, Jaipur, Rajasthan 302006');

-- ============================================================
-- SAMPLE DATA: 20 Inventory Logs
-- ============================================================
INSERT INTO inventory_log (product_id, stock_in, stock_out, transaction_date, notes) VALUES
(1,  200,   0, '2026-04-01 08:00:00', 'Initial stock - Basmati Rice'),
(1,    0,  80, '2026-05-01 10:00:00', 'Sales outflow'),
(2,  150,   0, '2026-04-01 08:00:00', 'Initial stock - Wheat Atta'),
(2,    0,  60, '2026-05-05 11:00:00', 'Sales outflow'),
(5,  500,   0, '2026-04-01 08:00:00', 'Initial stock - Milk'),
(5,    0, 200, '2026-05-10 09:00:00', 'Daily sales outflow'),
(6,  200,   0, '2026-04-05 09:00:00', 'Initial stock - Butter'),
(6,    0,  50, '2026-05-07 10:00:00', 'Sales outflow'),
(8,  120,   0, '2026-04-10 08:00:00', 'Initial stock - Mangoes'),
(8,    0,  40, '2026-05-08 11:00:00', 'Seasonal sales outflow'),
(10, 300,   0, '2026-04-15 08:00:00', 'Fresh stock - Spinach'),
(10,   0, 100, '2026-05-15 10:00:00', 'Weekly sales outflow'),
(13, 250,   0, '2026-04-01 08:00:00', 'Spice stock - Red Chilli'),
(13,   0,  90, '2026-05-20 09:00:00', 'Sales outflow'),
(18, 100,   0, '2026-04-01 08:00:00', 'Initial stock - Coconut Oil'),
(18,   0,  30, '2026-05-12 11:00:00', 'Sales outflow'),
(22, 100,   0, '2026-04-10 08:00:00', 'Initial stock - Honey'),
(22,   0,  40, '2026-05-22 10:00:00', 'Sales outflow'),
(24,  80,   0, '2026-04-20 08:00:00', 'Fresh catch - Rohu Fish'),
(24,   0,  40, '2026-05-17 11:00:00', 'Quick sales - perishable');

-- ============================================================
-- VIEWS
-- ============================================================

-- View 1: Complete Order Summary
CREATE OR REPLACE VIEW vw_order_summary AS
SELECT
    o.order_id,
    c.customer_name,
    c.email         AS customer_email,
    o.order_date,
    o.total_amount,
    o.order_status,
    p.payment_method,
    p.payment_status,
    d.delivery_status,
    d.delivery_date
FROM orders o
JOIN customers  c ON o.customer_id   = c.customer_id
LEFT JOIN payments p ON o.order_id   = p.order_id
LEFT JOIN delivery d ON o.order_id   = d.order_id;

-- View 2: Product Inventory Overview
CREATE OR REPLACE VIEW vw_inventory_overview AS
SELECT
    pr.product_id,
    pr.product_name,
    pr.category,
    s.supplier_name,
    pr.price,
    pr.stock_quantity,
    pr.expiry_date,
    CASE
        WHEN pr.stock_quantity = 0      THEN 'Out of Stock'
        WHEN pr.stock_quantity <= 30    THEN 'Low Stock'
        WHEN pr.stock_quantity <= 100   THEN 'Medium Stock'
        ELSE 'Adequate Stock'
    END AS stock_status
FROM products pr
JOIN suppliers s ON pr.supplier_id = s.supplier_id;

-- View 3: Sales Report by Category
CREATE OR REPLACE VIEW vw_sales_by_category AS
SELECT
    pr.category,
    COUNT(DISTINCT o.order_id)    AS total_orders,
    SUM(od.quantity)              AS total_units_sold,
    SUM(od.subtotal)              AS total_revenue
FROM order_details od
JOIN products pr ON od.product_id = pr.product_id
JOIN orders   o  ON od.order_id   = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY pr.category
ORDER BY total_revenue DESC;

-- View 4: Customer Purchase History
CREATE OR REPLACE VIEW vw_customer_purchase_history AS
SELECT
    c.customer_id,
    c.customer_name,
    c.email,
    COUNT(DISTINCT o.order_id)  AS total_orders,
    SUM(o.total_amount)         AS lifetime_value,
    MAX(o.order_date)           AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name, c.email;

-- View 5: Low Stock Alert
CREATE OR REPLACE VIEW vw_low_stock_alert AS
SELECT
    pr.product_id,
    pr.product_name,
    pr.category,
    s.supplier_name,
    s.contact_no   AS supplier_contact,
    pr.stock_quantity,
    pr.expiry_date
FROM products pr
JOIN suppliers s ON pr.supplier_id = s.supplier_id
WHERE pr.stock_quantity <= 50
ORDER BY pr.stock_quantity ASC;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

DELIMITER $$

-- Procedure 1: Place a new order
CREATE PROCEDURE sp_place_order(
    IN  p_customer_id   INT,
    IN  p_product_id    INT,
    IN  p_quantity      INT,
    IN  p_payment_method VARCHAR(30),
    OUT p_order_id      INT,
    OUT p_message       VARCHAR(200)
)
BEGIN
    DECLARE v_price         DECIMAL(10,2);
    DECLARE v_stock         INT;
    DECLARE v_subtotal      DECIMAL(10,2);
    DECLARE v_delivery_addr TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_message = 'Error: Transaction rolled back due to an exception.';
    END;

    START TRANSACTION;

    -- Fetch price and stock
    SELECT price, stock_quantity INTO v_price, v_stock
    FROM products WHERE product_id = p_product_id FOR UPDATE;

    IF v_stock < p_quantity THEN
        SET p_message = 'Error: Insufficient stock.';
        ROLLBACK;
    ELSE
        SET v_subtotal = v_price * p_quantity;

        -- Insert order
        INSERT INTO orders (customer_id, total_amount, order_status)
        VALUES (p_customer_id, v_subtotal, 'Pending');
        SET p_order_id = LAST_INSERT_ID();

        -- Insert order detail
        INSERT INTO order_details (order_id, product_id, quantity, subtotal)
        VALUES (p_order_id, p_product_id, p_quantity, v_subtotal);

        -- Deduct stock
        UPDATE products SET stock_quantity = stock_quantity - p_quantity
        WHERE product_id = p_product_id;

        -- Log inventory
        INSERT INTO inventory_log (product_id, stock_out, notes)
        VALUES (p_product_id, p_quantity, CONCAT('Order #', p_order_id));

        -- Create payment record
        INSERT INTO payments (order_id, payment_method, payment_status, amount)
        VALUES (p_order_id, p_payment_method, 'Pending', v_subtotal);

        -- Delivery address from customer
        SELECT address INTO v_delivery_addr FROM customers WHERE customer_id = p_customer_id;

        INSERT INTO delivery (order_id, delivery_status, delivery_address)
        VALUES (p_order_id, 'Pending', v_delivery_addr);

        SET p_message = CONCAT('Success: Order #', p_order_id, ' placed successfully.');
        COMMIT;
    END IF;
END $$

-- Procedure 2: Monthly Revenue Report
CREATE PROCEDURE sp_monthly_revenue(IN p_year INT)
BEGIN
    SELECT
        MONTHNAME(o.order_date) AS month_name,
        MONTH(o.order_date)     AS month_num,
        COUNT(o.order_id)       AS total_orders,
        SUM(o.total_amount)     AS total_revenue,
        AVG(o.total_amount)     AS avg_order_value
    FROM orders o
    WHERE YEAR(o.order_date) = p_year
      AND o.order_status != 'Cancelled'
    GROUP BY MONTH(o.order_date), MONTHNAME(o.order_date)
    ORDER BY month_num;
END $$

-- Procedure 3: Restock product
CREATE PROCEDURE sp_restock_product(
    IN p_product_id  INT,
    IN p_quantity    INT,
    IN p_notes       VARCHAR(255)
)
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity + p_quantity
    WHERE product_id = p_product_id;

    INSERT INTO inventory_log (product_id, stock_in, notes)
    VALUES (p_product_id, p_quantity, p_notes);

    SELECT CONCAT('Restocked product #', p_product_id, ' with ', p_quantity, ' units.') AS result;
END $$

DELIMITER ;

-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER $$

-- Trigger 1: Auto-log inventory on product stock update
CREATE TRIGGER trg_after_product_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.stock_quantity > OLD.stock_quantity THEN
        INSERT INTO inventory_log (product_id, stock_in, notes)
        VALUES (NEW.product_id, NEW.stock_quantity - OLD.stock_quantity, 'Stock updated via product edit');
    ELSEIF NEW.stock_quantity < OLD.stock_quantity THEN
        INSERT INTO inventory_log (product_id, stock_out, notes)
        VALUES (NEW.product_id, OLD.stock_quantity - NEW.stock_quantity, 'Stock reduced via product edit');
    END IF;
END $$

-- Trigger 2: Update order total when order_detail changes
CREATE TRIGGER trg_after_od_insert
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE orders
    SET total_amount = (
        SELECT IFNULL(SUM(subtotal), 0)
        FROM order_details
        WHERE order_id = NEW.order_id
    )
    WHERE order_id = NEW.order_id;
END $$

-- Trigger 3: Auto-set delivery date when status = Delivered
CREATE TRIGGER trg_delivery_status_update
BEFORE UPDATE ON delivery
FOR EACH ROW
BEGIN
    IF NEW.delivery_status = 'Delivered' AND OLD.delivery_status != 'Delivered' THEN
        SET NEW.delivery_date = CURDATE();
    END IF;
END $$

-- Trigger 4: Update order_status when payment completes
CREATE TRIGGER trg_after_payment_complete
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'Completed' AND OLD.payment_status != 'Completed' THEN
        UPDATE orders SET order_status = 'Processing' WHERE order_id = NEW.order_id;
    END IF;
END $$

DELIMITER ;

-- ============================================================
-- ADVANCED SQL QUERIES (20+)
-- ============================================================

-- Q1: INNER JOIN – Orders with customer and payment info
SELECT o.order_id, c.customer_name, o.order_date, o.total_amount, p.payment_method
FROM orders o
INNER JOIN customers c  ON o.customer_id = c.customer_id
INNER JOIN payments  p  ON o.order_id    = p.order_id;

-- Q2: LEFT JOIN – All customers with their order count (including those with no orders)
SELECT c.customer_name, c.email, COUNT(o.order_id) AS total_orders
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name, c.email
ORDER BY total_orders DESC;

-- Q3: RIGHT JOIN – All products including those never ordered
SELECT pr.product_name, pr.category, IFNULL(SUM(od.quantity), 0) AS total_sold
FROM order_details od
RIGHT JOIN products pr ON od.product_id = pr.product_id
GROUP BY pr.product_id, pr.product_name, pr.category
ORDER BY total_sold DESC;

-- Q4: Nested Query – Customers who spent more than the average order value
SELECT customer_name, email FROM customers
WHERE customer_id IN (
    SELECT customer_id FROM orders
    WHERE total_amount > (SELECT AVG(total_amount) FROM orders)
);

-- Q5: Correlated Subquery – Products with above-average price in their category
SELECT product_name, category, price
FROM products p1
WHERE price > (
    SELECT AVG(price) FROM products p2 WHERE p2.category = p1.category
)
ORDER BY category, price DESC;

-- Q6: Aggregate – Total revenue, orders, and avg order value
SELECT
    COUNT(order_id)       AS total_orders,
    SUM(total_amount)     AS total_revenue,
    AVG(total_amount)     AS avg_order_value,
    MAX(total_amount)     AS max_order,
    MIN(total_amount)     AS min_order
FROM orders WHERE order_status != 'Cancelled';

-- Q7: GROUP BY – Revenue by order status
SELECT order_status, COUNT(*) AS count, SUM(total_amount) AS revenue
FROM orders
GROUP BY order_status
ORDER BY revenue DESC;

-- Q8: HAVING – Categories with more than 2 products
SELECT category, COUNT(*) AS product_count, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING COUNT(*) > 2
ORDER BY product_count DESC;

-- Q9: View – Use inventory overview view
SELECT * FROM vw_inventory_overview ORDER BY stock_status, stock_quantity;

-- Q10: Inventory Report – Stock movement per product
SELECT
    pr.product_name,
    IFNULL(SUM(il.stock_in),  0) AS total_stock_in,
    IFNULL(SUM(il.stock_out), 0) AS total_stock_out,
    pr.stock_quantity            AS current_stock
FROM products pr
LEFT JOIN inventory_log il ON pr.product_id = il.product_id
GROUP BY pr.product_id, pr.product_name, pr.stock_quantity
ORDER BY total_stock_out DESC;

-- Q11: Sales Report – Top 10 selling products by revenue
SELECT
    pr.product_name,
    pr.category,
    SUM(od.quantity)  AS units_sold,
    SUM(od.subtotal)  AS total_revenue
FROM order_details od
JOIN products pr ON od.product_id = pr.product_id
JOIN orders   o  ON od.order_id   = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY pr.product_id, pr.product_name, pr.category
ORDER BY total_revenue DESC
LIMIT 10;

-- Q12: Top Selling Products by quantity
SELECT pr.product_name, SUM(od.quantity) AS total_units
FROM order_details od
JOIN products pr ON od.product_id = pr.product_id
GROUP BY pr.product_id, pr.product_name
ORDER BY total_units DESC LIMIT 5;

-- Q13: Low Stock Products (qty <= 50)
SELECT product_name, category, stock_quantity, expiry_date
FROM products WHERE stock_quantity <= 50
ORDER BY stock_quantity ASC;

-- Q14: Monthly Revenue
SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    COUNT(*) AS orders,
    SUM(total_amount) AS revenue
FROM orders WHERE order_status != 'Cancelled'
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY month;

-- Q15: Customer Purchase History with total spend
SELECT
    c.customer_name,
    c.email,
    COUNT(o.order_id)  AS total_orders,
    SUM(o.total_amount) AS total_spent,
    MAX(o.order_date)   AS last_purchase
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name, c.email
ORDER BY total_spent DESC;

-- Q16: Supplier contribution to inventory value
SELECT
    s.supplier_name,
    COUNT(pr.product_id)              AS products_supplied,
    SUM(pr.price * pr.stock_quantity) AS inventory_value
FROM suppliers s
JOIN products pr ON s.supplier_id = pr.supplier_id
GROUP BY s.supplier_id, s.supplier_name
ORDER BY inventory_value DESC;

-- Q17: Delivery performance summary
SELECT
    delivery_status,
    COUNT(*) AS count
FROM delivery
GROUP BY delivery_status;

-- Q18: Payment method preference
SELECT payment_method, COUNT(*) AS times_used, SUM(amount) AS total_collected
FROM payments WHERE payment_status = 'Completed'
GROUP BY payment_method ORDER BY times_used DESC;

-- Q19: Orders pending delivery
SELECT o.order_id, c.customer_name, o.total_amount, d.delivery_status
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN delivery  d ON o.order_id    = d.order_id
WHERE d.delivery_status IN ('Pending', 'Dispatched', 'In Transit');

-- Q20: Expiring products in next 30 days
SELECT product_name, category, stock_quantity, expiry_date,
       DATEDIFF(expiry_date, CURDATE()) AS days_until_expiry
FROM products
WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY expiry_date;

-- Q21: Three-way join – Full order item breakdown
SELECT
    o.order_id,
    c.customer_name,
    pr.product_name,
    od.quantity,
    pr.price,
    od.subtotal
FROM orders o
JOIN customers   c  ON o.customer_id  = c.customer_id
JOIN order_details od ON o.order_id   = od.order_id
JOIN products    pr ON od.product_id  = pr.product_id
ORDER BY o.order_id, od.order_detail_id;

-- Q22: Revenue from completed payments only
SELECT
    c.customer_name,
    SUM(p.amount) AS paid_amount
FROM payments p
JOIN orders   o ON p.order_id    = o.order_id
JOIN customers c ON o.customer_id = c.customer_id
WHERE p.payment_status = 'Completed'
GROUP BY c.customer_id, c.customer_name
ORDER BY paid_amount DESC;

-- ============================================================
-- END OF SCRIPT
-- ============================================================



INSERT INTO customers (customer_name, email, phone, address) VALUES
('John Doe', 'john.doe@example.com', '123-456-7890', '123 Elm St, Springfield, IL'),
('Jane Smith', 'jane.smith@example.com', '987-654-3210', '456 Oak St, Springfield, IL'),
('Alice Johnson', 'alice.johnson@example.com', '555-123-4567', '789 Pine St, Springfield, IL'),
('Bob Brown', 'bob.brown@example.com', '555-987-6543', '321 Maple St, Springfield, IL');

