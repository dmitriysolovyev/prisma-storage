import { ColumnMeta, DataDefinder } from "@storage/interfaces";
import { ColumnTypeName } from "@storage/types";
import { ColumnMetaImpl } from "./column-meta";

export class MetaService implements DataDefinder {
    private readonly _columns = new Map<string, ColumnMeta>();

    defineColumnByValue(name: string, value: string): void {
        const newType = this.detectType(value);

        const column = this._columns.get(name);

        if (!column) {
            this._columns.set(name, new ColumnMetaImpl(name, newType));

            return;
        }

        if (newType === column.type) {
            return;
        }

        // Change number -> string
        if (column.type === "number" && newType === "string") {
            this._columns.set(name, new ColumnMetaImpl(name, newType));
        }
    }

    get columns(): Array<ColumnMeta> {
        return [...this._columns.values()];
    }

    private detectType(value: string): ColumnTypeName {
        if (/^\d+$/.test(value)) {
            return "number";
        }

        return "string";
    }
}
