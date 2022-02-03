CREATE DATABASE user_management;

USE user_management;

CREATE TABLE users(
    id int(11) NOT NULL AUTO_INCREMENT,
    nombre varchar(80) NOT NULL,
    apellido varchar(80) NOT NULL,
    email varchar(255) NOT NULL,
    date_added DATETIME NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

DESCRIBE users;