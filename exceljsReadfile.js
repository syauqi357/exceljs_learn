// import Exceljs, {stream} from "exceljs";

export async function readExcelFile(workbook) {

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
        return data;
    } catch(error) {
        console.error("error :", error.message);
        return [];
    }
}
