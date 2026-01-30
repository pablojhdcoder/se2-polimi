CREATE TYPE path_status_enum AS ENUM (
    'optimal',
    'under_maintenance',
    'path_closed',
    'requires_maintenance',
    'unsafe'
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paths (
    id UUID PRIMARY KEY,
    path_name VARCHAR(100) NOT NULL,

    start_x INTEGER NOT NULL,
    start_y INTEGER NOT NULL,
    end_x INTEGER NOT NULL,
    end_y INTEGER NOT NULL,

    length INTEGER NOT NULL,

    user_rating INTEGER, -- calculated
    status path_status_enum NOT NULL

    posted_by_username VARCHAR(50) NOT NULL,

    
    CONSTRAINT fk_path_user
        FOREIGN KEY (posted_by_username)
        REFERENCES users(username)
        ON DELETE CASCADE
);

CREATE TABLE saved_paths (
    username VARCHAR(50) NOT NULL,
    path_name VARCHAR(100) NOT NULL,

    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (username, path_name),

    CONSTRAINT fk_saved_user
        FOREIGN KEY (username)
        REFERENCES users(username)
        ON DELETE CASCADE,

    CONSTRAINT fk_saved_path
        FOREIGN KEY (path_name)
        REFERENCES paths(path_name)
        ON DELETE CASCADE
);

CREATE TABLE ratings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    path_id UUID NOT NULL,

    points INTEGER NOT NULL CHECK (points BETWEEN 1 AND 5),
    opinion TEXT,
    reported_status path_status_enum NOT NULL,

    CONSTRAINT fk_rating_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rating_path
        FOREIGN KEY (path_id) REFERENCES paths(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_path_rating
        UNIQUE (user_id, path_id)
);

CREATE TABLE trips (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    path_id UUID NOT NULL,

    trip_date TIMESTAMP NOT NULL,
    trip_length INTEGER NOT NULL,
    personal_rating INTEGER CHECK (personal_rating BETWEEN 1 AND 5),

    -- Weather data (nullable)
    temperature INTEGER,

    wind_speed INTEGER,
    wind_degree INTEGER,
    wind_gust FLOAT,

    visibility INTEGER,
    rain FLOAT,
    clouds INTEGER,

    CONSTRAINT fk_trip_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_trip_path
        FOREIGN KEY (path_id) REFERENCES paths(id)
        ON DELETE CASCADE
);

CREATE TABLE potholes (
    id UUID PRIMARY KEY,
    path_id UUID NOT NULL,

    location_x INTEGER NOT NULL,
    location_y INTEGER NOT NULL,

    detected_date TIMESTAMP NOT NULL,
    size INTEGER NOT NULL,

    CONSTRAINT fk_pothole_path
        FOREIGN KEY (path_id) REFERENCES paths(id)
        ON DELETE CASCADE
);