import Exceljs from "exceljs";

async function createExcelFile() {
// create new work book
    const workbook = new Exceljs.Workbook();

    workbook.calcProperties.fullCalcOnLoad =true;

    workbook.views = [
        {
            x: 0,
            y: 0,
            width: 10000,
            height: 20000,
            firstSheet: 0,
            activeTab: 1,
            visibility: 'visible'
        }
    ]

    const sheet = workbook.addWorksheet('student')

// Add header row
    sheet.addRow(["ID", "Name", "Age", "Status"]);

// Save the workbook to a file
    await workbook.xlsx.writeFile("students.xlsx");
    console.log("File saved as 'students.xlsx'");

};

createExcelFile();




