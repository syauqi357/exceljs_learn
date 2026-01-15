import {createPool} from "mysql2/promise";

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "exceljs_learning"
});

export async function inserdatatodb(data) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const studentQuery = "INSERT INTO students (id, name, age) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), age=VALUES(age)";
        
        // Note: using 'student_id' here to match the new schema
        const statusQuery = "INSERT INTO status_student (student_id, status) VALUES (?,?) ON DUPLICATE KEY UPDATE status=VALUES(status)";

        for (const row of data){
            // 1. Insert into students table first (Parent)
            await connection.query(studentQuery, [row.id, row.name, row.age]);

            // 2. Insert into status_student table (Child)
            if (row.status) {
                await connection.query(statusQuery, [row.id, row.status]);
            }
        }

        await connection.commit();
        console.log("Data inserted into both tables successfully");
    } catch (error) {
        await connection.rollback();
        console.error("Error inserting data:", error.message);
        throw error; 
    } finally {
        connection.release();
    }
}

export async function getAllStudents() {
    const query = `
        SELECT
            students.id AS id,
            students.name,
            students.age,
            status_student.status
        FROM students
        JOIN status_student ON students.id = status_student.student_id;
    `;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error("Error fetching students:", error.message);
        return [];
    }
}