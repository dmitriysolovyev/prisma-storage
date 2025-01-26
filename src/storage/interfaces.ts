import { ColumnTypeName, DocumentId, Index, RawDocument } from "./types";

export interface Document {
    get id(): DocumentId;
    get raw(): RawDocument;
    get columnNames(): string[];
    pickColumns(columns: string[]): Document;
}

export interface ColumnMeta {
    get name(): string;
    get type(): ColumnTypeName;
}

export interface DataManipulator {
    insert(document: RawDocument): DocumentId;
}

export interface DataRequester {
    findById(id: DocumentId, columns?: Array<string>): Document;
    findAll(columns?: Array<string>): Document[];
}

export interface DataDefinder {
    defineColumnByValue(name: string, value: string): void;
    get columns(): Array<ColumnMeta>;
}

export interface IndexApi {
    getIndex(column: ColumnMeta): Index;
    create(column: ColumnMeta): void;
    findOne(column: ColumnMeta, value: string): DocumentId;
    traversalFrom(column: ColumnMeta, value: string): Array<DocumentId>;
}
