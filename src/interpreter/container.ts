import { indexService, metaService, storageService } from "@storage/container";
import { InterpreterService } from "./interpreter.service";

// TODO Use DI lib
export const interpreterService = new InterpreterService(storageService, indexService, metaService);
