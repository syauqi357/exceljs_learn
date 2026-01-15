# Dokumentasi Pembelajaran ExcelJS

Dokumen ini merangkum konsep-konsep yang telah dipelajari dan diimplementasikan mengenai pustaka `exceljs` untuk menangani file Excel di Node.js, termasuk membuat, membaca, dan mengintegrasikan data dengan database MySQL.

## 1. Membuat File Excel (`exceljs.js`)

Skrip ini mendemonstrasikan cara membuat file Excel baru dari awal.

### Konsep Utama:
-   **Pembuatan Workbook**: `new Exceljs.Workbook()` menginisialisasi workbook baru.
-   **Properti Workbook**: Mengatur properti seperti `fullCalcOnLoad` dan mengonfigurasi `views` (misalnya, visibilitas, tab aktif).
-   **Worksheet**: `workbook.addWorksheet('student')` membuat sheet baru bernama 'student'.
-   **Menambahkan Data**:
    -   `sheet.addRow([...])` digunakan untuk menambahkan baris header maupun baris data.
-   **Menyimpan**: `workbook.xlsx.writeFile("students.xlsx")` menyimpan workbook yang telah dibuat ke sistem file.

## 2. Membaca File Excel (`exceljsReadfile.js`)

Skrip ini berfokus pada membaca file Excel yang sudah ada dan mem-parsing isinya menjadi struktur objek JavaScript yang dapat digunakan.

### Konsep Utama:
-   **Membaca**: `workbook.xlsx.readFile("students.xlsx")` memuat file.
-   **Mengakses Sheet**: `workbook.getWorksheet(1)` mengambil worksheet pertama.
-   **Parsing Data**:
    -   Melakukan iterasi baris menggunakan `sheet.eachRow((row, rowNumber) => { ... })`.
    -   Melewati baris header (`if(rowNumber === 1) return;`).
    -   Memetakan nomor kolom ke kunci (misalnya, `1: "id"`, `2: "name"`) untuk menyusun objek JSON.
    -   Melakukan iterasi sel dengan `row.eachCell(...)` untuk mengambil nilai.

## 3. Integrasi Database (`exceljsInsertData.js`)

Modul ini menangani penyisipan data yang telah di-parsing ke dalam database MySQL.

### Konsep Utama:
-   **Koneksi MySQL**: Menggunakan `mysql2/promise` untuk membuat connection pool.
-   **Logika Penyisipan**:
    -   Melakukan iterasi melalui array data.
    -   Menjalankan query `INSERT` untuk setiap rekaman: `INSERT INTO students (id, name, age) VALUES (?,?,?)`.

## 4. Alur Eksekusi Utama (`index.js`)

Titik masuk (entry point) yang mengatur seluruh proses.

### Alur Kerja:
1.  Memanggil `readExcelFile()` untuk mendapatkan data dari `students.xlsx`.
2.  Meneruskan data yang diambil ke `inserdatatodb(data)` untuk menyimpannya ke dalam database.
3.  Menyertakan penanganan error dengan blok `try-catch`.

## 5. Struktur Data (`data/student.json`)

Merepresentasikan struktur JSON dari data siswa yang digunakan dalam proyek, berisi field untuk `id`, `name`, dan `age`.

```json
[
  {
    "id": 1,
    "name": "Alice",
    "age": 23
  },
  ...
]
```

## 6. Saran: Integrasi dengan Drizzle ORM

Untuk memodernisasi interaksi database dan meningkatkan keamanan tipe (type safety), mengintegrasikan **Drizzle ORM** adalah langkah selanjutnya yang sangat baik. Ini dapat menggantikan query SQL mentah di `exceljsInsertData.js`.

### Manfaat:
-   **Keamanan Tipe (Type Safety)**: Dukungan TypeScript memastikan data Anda sesuai dengan skema database.
-   **Sintaks yang Lebih Bersih**: Tidak perlu lagi menulis string SQL mentah; gunakan objek dan fungsi JavaScript/TypeScript.
-   **Manajemen Migrasi**: Drizzle Kit mempermudah penanganan perubahan skema database.
-   **Batch Inserts**: Drizzle memudahkan penyisipan seluruh array data dalam satu query, meningkatkan performa.

### Contoh Konsep Implementasi:

Alih-alih menulis `INSERT INTO ...` secara manual, Anda akan mendefinisikan skema dan menggunakan metode `insert` dari Drizzle.

**1. Definisikan Skema (`schema.ts`):**
```typescript
import { mysqlTable, serial, varchar, int } from 'drizzle-orm/mysql-core';

export const students = mysqlTable('students', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  age: int('age'),
});
```

**2. Sisipkan Data (`exceljsInsertData.js` yang direfaktor):**
```javascript
import { drizzle } from "drizzle-orm/mysql2";
import { students } from "./schema";

// ... pengaturan koneksi ...
const db = drizzle(pool);

export async function insertDataWithDrizzle(data) {
    // Drizzle memungkinkan penyisipan banyak baris sekaligus!
    await db.insert(students).values(data);
    console.log("Data berhasil disisipkan dengan Drizzle!");
}
```
