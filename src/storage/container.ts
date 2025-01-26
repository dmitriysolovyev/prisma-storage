import { StorageService } from "./core/storage.service";
import { IndexService } from "./index/index.service";
import { MetaService } from "./meta/meta.service";

// TODO Use DI lib
// TODO Use Facade pattern to have one API for storage
export const metaService = new MetaService();
export const storageService = new StorageService(metaService);
export const indexService = new IndexService(storageService);
