import ExcelJS from "exceljs";
import express from "express";
import multer from "multer";
import { READ_EXCEL_FILES } from "./exceljsReadfile.js";
import { INSERTDATA_TO_DATABASE, getAllStudents } from "./exceljsInsertData.js";
import { slow_down } from "./middleware/throttleslowdown.js";
import {rate_limit} from "./middleware/ratelimit.js";
import {configDotenv} from "dotenv";
import * as dotenv from "dotenv";
import path from 'path'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT_SERVER;


// Configure Multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

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

app.post('/uploads', upload.single('excelFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = new ExcelJS.Workbook();
        // Load the workbook from the buffer provided by multer
        await workbook.xlsx.load(req.file.buffer);

        // Parse the excel file
        const data = await READ_EXCEL_FILES(workbook);

        // Insert data into database
        await INSERTDATA_TO_DATABASE(data);

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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/public/inputexcel.html')
})

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.URL_SET}${PORT}`);
});
