import { DocumentId, RawDocument } from "@storage/types";
import { DataDefinder, DataManipulator, DataRequester, Document } from "@storage/interfaces";
import { DocumentImpl } from "./document";

export class StorageService implements DataManipulator, DataRequester {
    private readonly _data = new Map<string, Document>();

    constructor(private readonly _meta: DataDefinder) {}

    insert(rawDocument: RawDocument): DocumentId {
        // TODO check columns / types

        const document = new DocumentImpl(rawDocument);
        this._data.set(document.id.value, document);

        document.columnNames.forEach((columnName) => {
            this._meta.defineColumnByValue(columnName, rawDocument[columnName]);
        });

        return document.id;
    }

    findById(id: DocumentId, columns?: Array<string>): Document {
        // TODO check columns

        const document = this._data.get(id.value);

        if (!document) {
            throw new Error(`${Storage.name}.findById. Not found. id = ${id.value}`);
        }

        if (!columns || columns.length === 0) {
            return document;
        }

        return document.pickColumns(columns);
    }

    findAll(columns?: Array<string>): Document[] {
        // TODO check columns

        const data = [...this._data.values()];

        if (!columns || columns.length === 0) {
            return data;
        }

        return data.map((document) => document.pickColumns(columns));
    }
}
