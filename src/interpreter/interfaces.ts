import { InterpreterResult } from "./types";

export interface Interpreter {
    interpret(statement: string): Promise<InterpreterResult>;
}
