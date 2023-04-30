"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArweaveClientError = void 0;
class ArweaveClientError extends Error {
    type;
    constructor(message, type) {
        super(message);
        this.type = type;
    }
}
exports.ArweaveClientError = ArweaveClientError;
//# sourceMappingURL=arweave-client.error.js.map