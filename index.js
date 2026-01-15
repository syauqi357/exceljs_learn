import {READ_EXCEL_FILES} from "./exceljsReadfile.js";
import {inserdatatodb} from "./exceljsInsertData.js";

async function main() {
    try{
        const DATA_FROM_EXCEL = await READ_EXCEL_FILES()
        await inserdatatodb(DATA_FROM_EXCEL)
    }catch (error) {
        console.error("error :",error.message);
    }
}

main();