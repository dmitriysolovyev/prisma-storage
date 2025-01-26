import { Id } from "@storage/types";

export class IdImpl<T> implements Id<T> {
    constructor(private readonly _id: T) {}

    get value(): T {
        return this._id;
    }
}
