export interface Logger {
    log: (...messages: string[]) => void;
    error: (...messages: (string | Error)[]) => void;
    verbose: (...messages: (string | Error)[]) => void;
}
//# sourceMappingURL=logger.d.ts.map