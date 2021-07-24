DROP database businessDB;

CREATE database businessDB;

USE businessDB;

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
name varchar(30),
PRIMARY KEY (id)
);

CREATE TABLE position (
id INT NOT NULL AUTO_INCREMENT,
title varchar(30),
salary dec(10,2),
department_id INT NOT NULL, 
PRIMARY KEY (id)
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name varchar(30),
last_name varchar(30),
role_id INT,
manager_id INT,
PRIMARY KEY (id)
);
