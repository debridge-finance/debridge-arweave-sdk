import { ArweaweTag } from "./types/arweawe.tag";
import { Context } from "./types/context";
import { ArweaveConnectorResponse } from "./types/arweave.connector-response";
/**
 * ArweaveConnector request arweave node for getting data from arweave using thegraph
 * For creating instance of ArweaveConnector you should to put arweaveNode and txOwners.
 * txOwners is variables for setuping a list of tx owners. Its important for avoiding spam messages.
 */
export declare class ArweaveConnector {
    private readonly arweaveNode;
    private readonly txOwners;
    constructor(arweaveNode: string, txOwners: string[]);
    /**
     * Get tx info by tags
     * @param tags
     * @param context
     */
    getTxsByTags(tags: ArweaweTag[], context: Context): Promise<ArweaveConnectorResponse>;
    private generateQueryWithTags;
}
//# sourceMappingURL=arweave.connector.d.ts.map