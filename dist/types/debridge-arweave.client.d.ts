import { Context } from "./types/context";
import { SubmissionArweaveRecord } from "./types/submission.arweave-record";
import { AssetConfirmationArweaveRecord } from "./types/asset.confirmation.arweave-record";
type ValidatorConfig = {
    arweave: string;
    validator: string;
    name: string;
};
/**
 * DebridgeArweaveClient is a class for receiving debridge transactions from arweave.
 * For creating instance of ArweaveConnector you should to put arweaveNode and txOwners.
 * txOwners is variables for setuping a list of tx owners. Its important for avoiding spam messages.
 */
export declare class DebridgeArweaveClient {
    private readonly arweaweConnector;
    private readonly web3;
    private readonly validatorNames;
    constructor(arweaveNode: string, validators: ValidatorConfig[]);
    /**
     * Get signed submission transactions from arweave by id
     * @param submissionId
     * @param context
     */
    getSubmissionConfirmations(submissionId: string, context: Context): Promise<SubmissionArweaveRecord[]>;
    /**
     * Get signed new asset confirmations transactions from arweave by debridgeId
     * @param debridgeId
     * @param context
     */
    getNewAssetConfirmationsByDebridgeId(debridgeId: string, context: Context): Promise<AssetConfirmationArweaveRecord[]>;
    /**
     * Get signed new asset confirmations transactions from arweave by deployId
     * @param deployId
     * @param context
     */
    getNewAssetConfirmationsByDeployId(deployId: string, context: Context): Promise<AssetConfirmationArweaveRecord[]>;
    /**
     * Get signed new asset confirmations transactions from arweave by tokenAddress
     * @param tokenAddress
     * @param nativeChainId
     * @param context
     */
    getNewAssetConfirmationsByTokenAddress(tokenAddress: string, nativeChainId: number, context: Context): Promise<AssetConfirmationArweaveRecord[]>;
    private getNewAssetConfirmations;
    private filterDuplicates;
}
export {};
//# sourceMappingURL=debridge-arweave.client.d.ts.map