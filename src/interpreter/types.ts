export type InterpreterResult = Array<Record<string, string>>;

export type Condition = "=" | ">";
export type Filter = {
    column: string;
    valueItem: string;
    condition: Condition;
};

export type Query = {
    // list of columns
    project: string[];
    filter?: Filter;
};
