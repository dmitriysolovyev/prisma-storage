import * as fs from "fs";
import path from "path";
import { CsvLoader } from "@loader/index";
import { MetaService, StorageService } from "@storage/index";

// TODO Add negative cases

describe.only("CsvLoader", (): void => {
    describe("loadFromStream", (): void => {
        it("should create index", async (): Promise<void> => {
            const storageService = new StorageService(new MetaService());
            const csvLoader = new CsvLoader(storageService);
            const csvPath = path.resolve(__dirname, "./assets/prisma_data1.csv");
            const readableStream = fs.createReadStream(csvPath);

            await csvLoader.loadFromStream(readableStream);

            expect(storageService.findAll().length).toBe(7);
        });
    });
});
