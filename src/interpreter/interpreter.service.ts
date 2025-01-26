import { DataDefinder, DataRequester, IndexApi } from "@storage/interfaces";
import { Interpreter } from "./interfaces";
import { Condition, Filter, InterpreterResult, Query } from "./types";

export class InterpreterService implements Interpreter {
    constructor(
        private readonly _storage: DataRequester,
        private readonly _index: IndexApi,
        private readonly _meta: DataDefinder,
    ) {}

    async interpret(statement: string): Promise<InterpreterResult> {
        const tokens = this._lexicalParsing(statement);
        const query = this._syntaxAnalysis(tokens);

        return this._executeQuery(query);
    }

    private _lexicalParsing(statement: string): string[] {
        // TODO Add support for "s t r i n g"
        // Currently it will be splitted
        return statement.split(" ").filter((token) => Boolean(token));
    }

    private _syntaxAnalysis(tokens: string[]): Query {
        if (tokens.length === 0) {
            throw new Error("Empty statement");
        }

        if (tokens[0].toUpperCase() !== "PROJECT") {
            throw new Error("Unknown statement. Waiting `PROJECT`");
        }

        const columns = this._getColumnsList(tokens.slice(1));

        if (columns.length === 0) {
            throw new Error("List of columns is empty");
        }

        const filterTokens = tokens.slice(1 + columns.length);
        if (filterTokens.length === 0) {
            return {
                project: columns,
            };
        }

        const filter = this._getFilter(filterTokens);

        return {
            project: columns,
            filter,
        };
    }

    private _getColumnsList(tokens: string[]): string[] {
        let i = 0;
        const columns = [];
        while (i < tokens.length) {
            // TODO Also validate wnen upload csv
            if (!/^[a-zA-Z0-9]+,?$/.test(tokens[i])) {
                throw new Error(`Column name is not correct ${tokens[i]}`);
            }
            columns.push(tokens[i].at(-1) === "," ? tokens[i].slice(0, -1) : tokens[i]);

            if (tokens[i].at(-1) !== ",") {
                break;
            }

            i++;
        }

        return columns;
    }

    private _getFilter(tokens: string[]): Filter {
        if (tokens[0].toUpperCase() !== "FILTER") {
            throw new Error("Unknown statement. Waiting `FILTER`");
        }

        if (tokens.length !== 4) {
            throw new Error("Filter statement is not correct. Example `FILTER col1 = 1`");
        }

        const condition = tokens[2];
        if (!this._checkCondition(condition)) {
            throw new Error("Filter condition is not correct. Waiting = or >`");
        }

        return {
            // TODO validate column
            column: tokens[1],
            valueItem: tokens[3],
            condition,
        };
    }

    private _checkCondition(condition: string): condition is Condition {
        if (["=", ">"].includes(condition)) {
            return true;
        }

        return false;
    }

    private async _executeQuery(query: Query): Promise<InterpreterResult> {
        if (!query.filter) {
            return this._storage.findAll(query.project).map((document) => document.raw);
        }

        const colMeta = this._meta.columns.find((col) => col.name === query.filter?.column);
        if (!colMeta) {
            throw new Error(`Unknown column ${query.filter?.column}`);
        }

        // TODO Uncouple. Class for optimization queries
        // check indexes
        // create only for query
        try {
            this._index.getIndex(colMeta);
        } catch (err) {
            // TODO Use type guard
            console.debug((err as Error).message);
            this._index.create(colMeta);
            console.debug(`Index created for ${colMeta.name}`);
        }

        if (query.filter.condition === "=") {
            const id = this._index.findOne(colMeta, query.filter.valueItem);

            return [this._storage.findById(id, query.project).raw];
        }

        const ids = this._index.traversalGreater(colMeta, query.filter.valueItem);

        return ids.map((id) => this._storage.findById(id, query.project).raw);
    }
}
