CREATE TABLE Ong (
    ong_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    link VARCHAR(255),
    logo VARCHAR(255)
);

CREATE TABLE OngContacts (
    ong_contacts_id SERIAL PRIMARY KEY,
    ong_id INTEGER NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    official_site VARCHAR(255),
    tik_tok VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    FOREIGN KEY (ong_id) REFERENCES Ong(ong_id) ON DELETE CASCADE
);

CREATE TABLE Restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    link VARCHAR(255),
    logo VARCHAR(255)
);

CREATE TABLE Donation (
    donation_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    quantity INTEGER,
    image_id VARCHAR(255),
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    transport_provided BOOLEAN,
    phone VARCHAR(20),
    pick_up_point VARCHAR(255),
    restaurant_id INTEGER REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE Donation_Driver (
    driver_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    approx_time INT,
    donation_id INTEGER UNIQUE REFERENCES Donation(donation_id) ON DELETE CASCADE
);
