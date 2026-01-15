import ExcelJS from "exceljs";
import express from "express";
import multer from "multer";
import { readExcelFile } from "./exceljsReadfile.js";
import { inserdatatodb, getAllStudents } from "./exceljsInsertData.js";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const app = express();
const PORT = 3000;

const timertensec = 10 * 1000 // 10 seconds

// Configure Multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

const rate_limit = rateLimit ({
    windowMs: timertensec, // 10 sec
    max: 10,
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
})

const slow_down = slowDown({
    windowMs: timertensec, // 10 sec
    delayAfter: 5, // Allow 5 requests per 15 minutes.
    delayMs: (hits) => hits * 100, // Add 100 ms of delay to every request after the 5th one.

    /**
     * So:
     *
     * - requests 1-5 are not delayed.
     * - request 6 is delayed by 600ms
     * - request 7 is delayed by 700ms
     * - request 8 is delayed by 800ms
     *
     * and so on. After 15 minutes, the delay is reset to 0.
     */
})

app.use(express.json());

app.use(rate_limit);
app.use(slow_down);


// Enable CORS manually
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/upload', upload.single('excelFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = new ExcelJS.Workbook();
        // Load the workbook from the buffer provided by multer
        await workbook.xlsx.load(req.file.buffer);

        // Parse the excel file
        const data = await readExcelFile(workbook);

        // Insert data into database
        await inserdatatodb(data);

        res.json({ message: 'File processed and data inserted successfully', data });
    } catch (e) {
        console.error('Error processing file:', e.message);
        res.status(500).json({ message: 'Error processing file: ' + e.message });
    }
});

app.get('/students', async (req, res) => {
    try {
        const students = await getAllStudents();
        res.json(students);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
