import {READ_EXCEL_FILES} from "./exceljsReadfile.js";
import {INSERTDATA_TO_DATABASE} from "./exceljsInsertData.js";

async function main() {
    try{
        const DATA_FROM_EXCEL = await READ_EXCEL_FILES()
        await INSERTDATA_TO_DATABASE(DATA_FROM_EXCEL)
    }catch (error) {
        console.error("error :",error.message);
    }
}

main();