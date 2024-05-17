CREATE DATABASE express_intro;
USE express_intro;

CREATE TABLE users (
	id BIGINT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO users (name, email, password) 
VALUES ("Taylor Swift","taylor@gmail.com","password"),
("Selena", "selena@gmail.com", "password"),
("Adele", "adele@gmail.com", "password");

