import { ColumnMeta } from "@storage/interfaces";
import { ColumnTypeName } from "@storage/types";

export class ColumnMetaImpl implements ColumnMeta {
    constructor(
        private readonly _name: string,
        private readonly _type: ColumnTypeName,
    ) {}

    get name(): string {
        return this._name;
    }
    get type(): ColumnTypeName {
        return this._type;
    }
}
