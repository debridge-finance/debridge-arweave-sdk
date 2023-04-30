import { ArweaveClientError } from "./arweave-client.error";
export class ArweaveRequestError extends ArweaveClientError {
    constructor(message) {
        super(message, ArweaveRequestError.name);
    }
}
//# sourceMappingURL=arweave-request.error.js.map