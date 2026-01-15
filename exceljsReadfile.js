// import Exceljs, {stream} from "exceljs";

import res from "express/lib/response.js";

export async function READ_EXCEL_FILES(workbook) {

    try{
        // const workbook = new Exceljs.Workbook();
        // await workbook.xlsx.read(stream);

        const sheet = workbook.getWorksheet(1);

        const headerMap = {
            1: "id",
            2: "name",
            3: "age",
            4: "status"
        }

        const DATA_JSON_PARSE = []

        sheet.eachRow((row, rowNumber) => {
            if(rowNumber === 1) return;

            const rowData = {};
            
            // Iterate over the columns defined in headerMap, not just the cells present in the row
            // This ensures we check for 'status' even if the cell is empty/undefined in the Excel file
            Object.keys(headerMap).forEach(colNumber => {
                const key = headerMap[colNumber];
                const cell = row.getCell(parseInt(colNumber));
                
                // Use cell.value if it exists, otherwise undefined (or handle defaults here)
                rowData[key] = cell.value;
            });

            DATA_JSON_PARSE.push(rowData);
        });
        // console.log("excel file content :");
        // console.log(DATA_JSON_PARSE);
        return DATA_JSON_PARSE;
    } catch(error) {
        res.json({
            "error ": error.message
        })
        // console.error("error :", error.message);
        return [];
    }
}
