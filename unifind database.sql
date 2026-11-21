CREATE DATABASE IF NOT EXISTS unifind_db;
USE unifind_db;
CREATE TABLE IF NOT EXISTS reports (
   id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),          -- 'Lost' ya 'Found' store karne ke liye
    name VARCHAR(255),         -- Reporter ka naam
    item_name VARCHAR(255),    -- Cheez ka naam (e.g. MacBook, Wallet)
    category VARCHAR(100),     -- Category (e.g. Electronics, Documents)
    location VARCHAR(255),     -- Kahan mili ya kahan gum hui
    email VARCHAR(255),        -- Contact email
    msg TEXT,                  -- Description
    image_url TEXT,            -- Pic ka link store karne ke liye
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
USE unifind_db;
SELECT * FROM reports;

