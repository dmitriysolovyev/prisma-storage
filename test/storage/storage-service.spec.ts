import { validate } from "uuid";
import { MetaService, StorageService } from "@storage/index";

// TODO Add negative cases

describe("StorageService", (): void => {
    describe("insert", (): void => {
        it("should insert document", async (): Promise<void> => {
            const storageService = new StorageService(new MetaService());
            const document = {
                p1: "string",
                p2: "12345",
            };

            const id = storageService.insert(document);

            expect(validate(id.value)).toBe(true);
        });
    });

    describe("findById", (): void => {
        it("should find document by id", async (): Promise<void> => {
            const storageService = new StorageService(new MetaService());
            const rawDocument = {
                p1: "string",
                p2: "12345",
            };
            const id = storageService.insert(rawDocument);

            const document = storageService.findById(id);

            expect(document.id.value).toBe(id.value);
            expect(document.raw).toStrictEqual(rawDocument);
            expect(document.columnNames.sort()).toEqual(["p1", "p2"]);
        });

        it("should find document by id with projection", async (): Promise<void> => {
            const storageService = new StorageService(new MetaService());
            const rawDocument = {
                p1: "string",
                p2: "12345",
            };
            const id = storageService.insert(rawDocument);

            const document = storageService.findById(id, ["p2"]);

            expect(document.id.value).toBe(id.value);
            expect(document.raw).not.toStrictEqual(rawDocument);
            expect(document.raw).toStrictEqual({
                p2: "12345",
            });
            expect(document.columnNames).toEqual(["p2"]);
        });
    });

    describe("findAll", (): void => {
        it("should find all document by id", async (): Promise<void> => {
            const storageService = new StorageService(new MetaService());
            const rawDocument1 = {
                p1: "string1",
                p2: "12345",
            };
            const rawDocument2 = {
                p1: "string2",
                p2: "123452",
            };
            storageService.insert(rawDocument1);
            storageService.insert(rawDocument2);

            const documents = storageService.findAll();

            expect(documents.length).toBe(2);
        });
    });
});
