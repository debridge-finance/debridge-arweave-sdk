export class ArweaveClientError extends Error {
    type;
    constructor(message, type) {
        super(message);
        this.type = type;
    }
}
//# sourceMappingURL=arweave-client.error.js.map