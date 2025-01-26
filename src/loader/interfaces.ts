import { Readable } from "stream";

export interface Loader {
    loadFromStream(stream: Readable): Promise<void>;
}
