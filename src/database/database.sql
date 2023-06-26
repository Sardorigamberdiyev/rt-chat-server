
CREATE TABLE rooms(
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    is_online BOOLEAN
);

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    msg TEXT,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    create_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(room_id) REFERENCES rooms(id)
);