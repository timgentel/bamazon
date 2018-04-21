CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  productName VARCHAR(100) NULL,
  departmentName VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stockQuantity INT NOT NULL,
  PRIMARY KEY (id)
);

select * from products;
