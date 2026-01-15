CREATE TABLE students (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(40),
    age INT
);

CREATE TABLE status_student (
    student_id INT NOT NULL PRIMARY KEY,
    status VARCHAR(30),
    CONSTRAINT fk_student
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);