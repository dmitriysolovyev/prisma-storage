import { storageService } from "@storage/container";
import { CsvLoader } from "./csv/csv-loader";

// TODO Use DI lib
export const csvLoader = new CsvLoader(storageService);
