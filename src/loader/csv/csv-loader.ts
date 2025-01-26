import { Readable } from "stream";
import { finished } from "stream/promises";
import { parse } from "csv-parse";
import { Loader } from "@loader/interfaces";
import { DataManipulator } from "@storage/interfaces";
import { RawDocument } from "@storage/types";

export class CscLoader implements Loader {
    constructor(private readonly _storage: DataManipulator) {}

    async loadFromStream(stream: Readable): Promise<void> {
        try {
            const parser = stream.pipe(parse({ columns: true }));

            parser.on("readable", () => {
                let record;
                while ((record = parser.read()) !== null) {
                    // TODO validate
                    this._insertDocument(record);
                }
            });
            await finished(parser);
        } catch (err) {
            throw new Error(`Error during CSV upload`, { cause: err });
        }
    }

    private _insertDocument(record: RawDocument) {
        this._storage.insert(record);
    }
}
