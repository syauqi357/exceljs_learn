import {readExcelFile} from "./exceljsReadfile.js";
import {inserdatatodb} from "./exceljsInsertData.js";

async function main() {
    try{
        const data = await readExcelFile()
        await inserdatatodb(data)
    }catch (error) {
        console.error("error :",error.message);
    }
}

main();