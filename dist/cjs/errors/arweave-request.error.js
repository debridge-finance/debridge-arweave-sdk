"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArweaveRequestError = void 0;
const arweave_client_error_1 = require("./arweave-client.error");
class ArweaveRequestError extends arweave_client_error_1.ArweaveClientError {
    constructor(message) {
        super(message, ArweaveRequestError.name);
    }
}
exports.ArweaveRequestError = ArweaveRequestError;
//# sourceMappingURL=arweave-request.error.js.map