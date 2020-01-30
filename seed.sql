DROP DATABASE IF EXISTS staff_db;
CREATE DATABASE staff_db;

USE staff_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO department(name)
VALUES ("Finance"), ("Legal"), ("Marketing"), ("IT"), ("Sales");

SELECT * FROM department;

INSERT INTO role(title, salary, department_id)
VALUES ("Director of Finance", 200000, 1), ("Financial Analyst", 120000, 1), ("General Counsel", 220000, 2), ("Attorney", 110000, 2), ("Marketing Manager", 150000, 3), ("Marketing Analyst", 100000, 3), ("Lead Software Developer", 250000, 4), ("Junior Software Developer", 150000, 4);

SELECT * FROM role;

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Laura", "Baker", 1, NULL), ("Jason", "Miller", 2, 1), ("Amanda", "Smith", 2, 1), ("Mark", "Johnson", 3, NULL), ("Rebecca", "Anderson", 4, 4), ("Nick", "Jackson", 5, NULL), ("Molly", "Rose", 6, 6), ("Cindy", "Martinez", 7, NULL), ("Andrew", "Carson", 8, 8), ("Melissa", "Velez", 8, 8);

SELECT * FROM employee;

SELECT a.id, a.first_name, a.last_name, role.title, role.salary, department.name, CONCAT(b.first_name ," " ,b.last_name) AS Manager
FROM department
RIGHT JOIN role ON role.department_id = department.id
RIGHT JOIN employee a ON a.role_id = role.id
LEFT JOIN employee b ON b.id = a.manager_id;
