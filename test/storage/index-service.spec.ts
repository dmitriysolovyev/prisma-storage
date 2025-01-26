import { IndexService, MetaService, StorageService } from "@storage/index";

// TODO Add negative cases

describe("IndexService", (): void => {
    describe("create", (): void => {
        it("should create index", async (): Promise<void> => {
            const metaService = new MetaService();
            const storageService = new StorageService(metaService);
            const indexService = new IndexService(storageService);
            const document1 = {
                p1: "string1",
                p2: "0",
            };
            const document2 = {
                p1: "string2",
                p2: "1",
            };
            storageService.insert(document1);
            storageService.insert(document2);
            const colMeta = metaService.columns.find((col) => col.name === "p1");
            if (!colMeta) {
                throw new Error("Column is not found");
            }

            indexService.create(colMeta);

            expect(indexService.getIndex(colMeta).length).toBe(2);
        });
    });

    describe("findOne", (): void => {
        it("should find document by string", async (): Promise<void> => {
            const metaService = new MetaService();
            const storageService = new StorageService(metaService);
            const indexService = new IndexService(storageService);
            const document1 = {
                p1: "string1",
                p2: "3",
            };
            const document2 = {
                p1: "string8",
                p2: "2",
            };
            const document3 = {
                p1: "string2",
                p2: "1",
            };
            storageService.insert(document1);
            const id2 = storageService.insert(document2);
            storageService.insert(document3);
            const colMeta = metaService.columns.find((col) => col.name === "p1");
            if (!colMeta) {
                throw new Error("Column is not found");
            }

            indexService.create(colMeta);

            expect(indexService.findOne(colMeta, "string8").value).toBe(id2.value);
        });
        it("should find document by number", async (): Promise<void> => {
            const metaService = new MetaService();
            const storageService = new StorageService(metaService);
            const indexService = new IndexService(storageService);
            const document1 = {
                p1: "string1",
                p2: "3",
            };
            const document2 = {
                p1: "string8",
                p2: "2",
            };
            const document3 = {
                p1: "string2",
                p2: "1",
            };
            storageService.insert(document1);
            storageService.insert(document2);
            const id3 = storageService.insert(document3);
            const colMeta = metaService.columns.find((col) => col.name === "p2");
            if (!colMeta) {
                throw new Error("Column is not found");
            }

            indexService.create(colMeta);

            expect(indexService.findOne(colMeta, "1").value).toBe(id3.value);
        });

        it("should throw error because can't find document by number", async (): Promise<void> => {
            const metaService = new MetaService();
            const storageService = new StorageService(metaService);
            const indexService = new IndexService(storageService);
            const document1 = {
                p1: "string1",
                p2: "3",
            };
            const document2 = {
                p1: "string8",
                p2: "2",
            };
            const document3 = {
                p1: "string2",
                p2: "1",
            };
            storageService.insert(document1);
            storageService.insert(document2);
            storageService.insert(document3);
            const colMeta = metaService.columns.find((col) => col.name === "p2");
            if (!colMeta) {
                throw new Error("Column is not found");
            }

            indexService.create(colMeta);

            expect(() => indexService.findOne(colMeta, "string1")).toThrow();
        });
    });

    describe("traversalFrom", (): void => {
        it("should traversal documents by string column", async (): Promise<void> => {
            const metaService = new MetaService();
            const storageService = new StorageService(metaService);
            const indexService = new IndexService(storageService);
            const document1 = {
                p1: "string1",
                p2: "3",
            };
            const document2 = {
                p1: "string8",
                p2: "2",
            };
            const document3 = {
                p1: "string2",
                p2: "1",
            };
            storageService.insert(document1);
            const id2 = storageService.insert(document2);
            const id3 = storageService.insert(document3);
            const colMeta = metaService.columns.find((col) => col.name === "p1");
            if (!colMeta) {
                throw new Error("Column is not found");
            }
            indexService.create(colMeta);

            const result = indexService.traversalFrom(colMeta, "string2");

            expect(result.length).toBe(2);
            expect(result[0].value).toBe(id3.value);
            expect(result[1].value).toBe(id2.value);
        });

        it("should traversal documents by number column", async (): Promise<void> => {
            const metaService = new MetaService();
            const storageService = new StorageService(metaService);
            const indexService = new IndexService(storageService);
            const document1 = {
                p1: "string1",
                p2: "40",
            };
            const document2 = {
                p1: "string8",
                p2: "200",
            };
            const document3 = {
                p1: "string2",
                p2: "1",
            };
            const id1 = storageService.insert(document1);
            const id2 = storageService.insert(document2);
            const id3 = storageService.insert(document3);
            const colMeta = metaService.columns.find((col) => col.name === "p2");
            if (!colMeta) {
                throw new Error("Column is not found");
            }
            indexService.create(colMeta);

            const result = indexService.traversalFrom(colMeta, "1");
            expect(result.length).toBe(3);
            expect(result[0].value).toBe(id3.value);
            expect(result[1].value).toBe(id1.value);
            expect(result[2].value).toBe(id2.value);
        });

        it("should traversal documents by number column, from not equal value", async (): Promise<void> => {
            const metaService = new MetaService();
            const storageService = new StorageService(metaService);
            const indexService = new IndexService(storageService);
            const document1 = {
                p1: "string1",
                p2: "40",
            };
            const document2 = {
                p1: "string8",
                p2: "200",
            };
            const document3 = {
                p1: "string2",
                p2: "1",
            };
            storageService.insert(document1);
            const id2 = storageService.insert(document2);
            storageService.insert(document3);
            const colMeta = metaService.columns.find((col) => col.name === "p2");
            if (!colMeta) {
                throw new Error("Column is not found");
            }
            indexService.create(colMeta);

            const result = indexService.traversalFrom(colMeta, "41");
            expect(result.length).toBe(1);
            expect(result[0].value).toBe(id2.value);
        });

        it("should return empty array", async (): Promise<void> => {
            const metaService = new MetaService();
            const storageService = new StorageService(metaService);
            const indexService = new IndexService(storageService);
            const document1 = {
                p1: "string1",
                p2: "40",
            };
            const document2 = {
                p1: "string8",
                p2: "200",
            };
            const document3 = {
                p1: "string2",
                p2: "1",
            };
            storageService.insert(document1);
            storageService.insert(document2);
            storageService.insert(document3);
            const colMeta = metaService.columns.find((col) => col.name === "p2");
            if (!colMeta) {
                throw new Error("Column is not found");
            }
            indexService.create(colMeta);

            const result = indexService.traversalFrom(colMeta, "201");
            expect(result.length).toBe(0);
        });
    });
});
