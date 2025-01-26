import { v4 } from "uuid";
import { DocumentId, RawDocument } from "@storage/types";
import { Document } from "@storage/interfaces";
import { IdImpl } from "./id";

export class DocumentImpl implements Document {
    private readonly _id: DocumentId;

    constructor(
        private readonly _document: RawDocument,
        id?: DocumentId,
    ) {
        if (!id) {
            this._id = new IdImpl(v4());
        } else {
            this._id = id;
        }
    }

    get id(): DocumentId {
        return this._id;
    }

    get raw(): RawDocument {
        return this._document;
    }

    get columnNames(): string[] {
        return Object.keys(this._document);
    }

    pickColumns(columns: string[]): Document {
        const document: RawDocument = {};

        for (const column in this._document) {
            if (columns.includes(column)) {
                document[column] = this._document[column];
            }
        }

        return new DocumentImpl(document, this._id);
    }
}
