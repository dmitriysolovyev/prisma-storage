import * as fs from "fs";
import { csvLoader } from "@loader/container";
import readline from "readline";
import { interpreterService } from "./interpreter";

const askQuestion = (question: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
            rl.close();
        });
    });
};

async function app() {
    console.log("Simplified query engine");
    console.log("Upload csv file with data");
    console.log("Run query `PROJECT col1, col2 FILTER col3 > value`");
    console.log("or `PROJECT col1, col2 FILTER col3 = value`");
    console.log("To exit, type: quit");
    console.log("---------------------------");

    const csvPath = await askQuestion(
        "Please provide path to csv file with data (`./assets/data1.csv`): ",
    );
    if (csvPath === "quit") {
        return;
    }

    const readableStream = fs.createReadStream(csvPath);
    await csvLoader.loadFromStream(readableStream);
    readableStream.close();

    while (true) {
        const query = await askQuestion("Run query: ");
        if (query === "quit") {
            return;
        }

        try {
            const result = await interpreterService.interpret(query);
            console.log(result);
        } catch (err) {
            // TODO Use type guard
            console.error((err as Error).message);
        }
    }
}

app().catch((err) => {
    console.error("Unexpected error", err);
    process.exit(1);
});
