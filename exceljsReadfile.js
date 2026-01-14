import Exceljs from "exceljs";

async function readExcelFile() {

    try{
        const workbook = new Exceljs.Workbook();
        await workbook.xlsx.readFile("students.xlsx");

        const sheet = workbook.getWorksheet(1);

        const data = []

        sheet.eachRow((row, rowNumber) => {
            if(rowNumber === 1) return;
            const rowData = {};
            row.eachCell((cell, colNumber) => {
                rowData[sheet.getColumn(colNumber).name] = cell.value;
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




