import Exceljs from "exceljs";

async function readExcelFile() {

    try{
        const workbook = new Exceljs.Workbook();
        await workbook.xlsx.readFile("students.xlsx");

        const sheet = workbook.getWorksheet(1);

        const headerMap = {
            1: "id",
            2: "name",
            3: "age"
        }

        const data = []

        sheet.eachRow((row, rowNumber) => {
            if(rowNumber === 1) return;

            const rowData = {};
            row.eachCell((cell, colNumber) => {
const key = headerMap[colNumber];
if(key) {
    rowData[key] = cell.value;
}
            });
            data.push(rowData);
        });
        console.log("excel file content :");
        console.log(data);
    } catch(error) {
        console.error("error :", error.message)
    }
}

readExcelFile();




