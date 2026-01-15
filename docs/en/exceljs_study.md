# ExcelJS Learning Documentation

This document summarizes the concepts learned and implemented regarding the `exceljs` library for handling Excel files in Node.js, including creating, reading, and integrating data with a MySQL database.

## 1. Creating Excel Files (`exceljs.js`)

This script demonstrates how to generate a new Excel file from scratch.

### Key Concepts:
-   **Workbook Creation**: `new Exceljs.Workbook()` initializes a new workbook.
-   **Workbook Properties**: Setting properties like `fullCalcOnLoad` and configuring `views` (e.g., visibility, active tab).
-   **Worksheet**: `workbook.addWorksheet('student')` creates a new sheet named 'student'.
-   **Adding Data**:
    -   `sheet.addRow([...])` is used to add both header and data rows.
-   **Saving**: `workbook.xlsx.writeFile("students.xlsx")` saves the generated workbook to the filesystem.

## 2. Reading Excel Files (`exceljsReadfile.js`)

This script focuses on reading an existing Excel file and parsing its content into a usable JavaScript object structure.

### Key Concepts:
-   **Reading**: `workbook.xlsx.readFile("students.xlsx")` loads the file.
-   **Accessing Sheets**: `workbook.getWorksheet(1)` retrieves the first worksheet.
-   **Data Parsing**:
    -   Iterating through rows using `sheet.eachRow((row, rowNumber) => { ... })`.
    -   Skipping the header row (`if(rowNumber === 1) return;`).
    -   Mapping column numbers to keys (e.g., `1: "id"`, `2: "name"`) to construct JSON objects.
    -   Iterating cells with `row.eachCell(...)` to extract values.

## 3. Database Integration (`exceljsInsertData.js`)

This module handles the insertion of parsed data into a MySQL database.

### Key Concepts:
-   **MySQL Connection**: Uses `mysql2/promise` to create a connection pool.
-   **Insertion Logic**:
    -   Iterates through the data array.
    -   Executes an `INSERT` query for each record: `INSERT INTO students (id, name, age) VALUES (?,?,?)`.

## 4. Main Execution Flow (`index.js`)

The entry point that orchestrates the entire process.

### Workflow:
1.  Calls `readExcelFile()` to get data from `students.xlsx`.
2.  Passes the retrieved data to `inserdatatodb(data)` to save it into the database.
3.  Includes error handling with `try-catch` blocks.

## 5. Data Structure (`data/student.json`)

Represents the JSON structure of the student data used in the project, containing fields for `id`, `name`, and `age`.

```json
[
  {
    "id": 1,
    "name": "Alice",
    "age": 23
  },
  "..."
]
```

## 6. Suggestion: Integration with Drizzle ORM

To modernize the database interaction and improve type safety, integrating **Drizzle ORM** is a great next step. It can replace the raw SQL queries in `exceljsInsertData.js`.

### Benefits:
-   **Type Safety**: TypeScript support ensures your data matches your database schema.
-   **Cleaner Syntax**: No more writing raw SQL strings; use JavaScript/TypeScript objects and functions.
-   **Migration Management**: Drizzle Kit makes handling database schema changes easier.
-   **Batch Inserts**: Drizzle makes it very easy to insert the entire array of data in a single query, improving performance.

### Example Implementation Concept:

Instead of manually writing `INSERT INTO ...`, you would define a schema and use Drizzle's `insert` method.

**1. Define Schema (`schema.ts`):**
```typescript
import { mysqlTable, serial, varchar, int } from 'drizzle-orm/mysql-core';

export const students = mysqlTable('students', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  age: int('age'),
});
```

**2. Insert Data (`exceljsInsertData.js` refactored):**
```javascript
import { drizzle } from "drizzle-orm/mysql2";
import { students } from "./schema";

// ... connection setup ...
const db = drizzle(pool);

export async function insertDataWithDrizzle(data) {
    // Drizzle allows inserting multiple rows at once!
    await db.insert(students).values(data);
    console.log("Data inserted with Drizzle!");
}
```
