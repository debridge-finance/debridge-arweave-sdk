import { ArweaveTag } from "./arweave.tag";
export type ArweaveResponse = {
    transactions: ArweaveResponseTransactions;
};
type ArweaveResponseTransactions = {
    edges: ArweaveResponseEdges[];
};
type ArweaveResponseEdges = {
    node: ArweaveResponseNode;
};
declare class ArweaveResponseNode {
    id: string;
    owner: {
        address: string;
    };
    tags: ArweaveTag[];
}
export {};
//# sourceMappingURL=arweave.response.d.ts.map