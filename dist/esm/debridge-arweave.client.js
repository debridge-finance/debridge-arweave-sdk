import { ArweaveConnector } from "./arweave.connector";
import Web3 from "web3";
/**
 * DebridgeArweaveClient is a class for receiving debridge transactions from arweave.
 * For creating instance of ArweaveConnector you should to put arweaveNode and txOwners.
 * txOwners is variables for setuping a list of tx owners. Its important for avoiding spam messages.
 */
export class DebridgeArweaveClient {
    arweaweConnector;
    web3 = new Web3();
    constructor(arweaveNode, txOwners) {
        this.arweaweConnector = new ArweaveConnector(arweaveNode, txOwners);
    }
    /**
     * Get signed submission transactions from arweave by id
     * @param submissionId
     * @param context
     */
    async getSubmissionConfirmations(submissionId, context) {
        const bundlrTxs = await this.arweaweConnector.getTxsByTags([{ name: 'submissionId', value: submissionId }], context);
        const signaturesData = bundlrTxs.map((bundlrTx) => {
            return {
                signature: bundlrTx.tags?.signature,
                submissionId: bundlrTx.tags.submissionId,
                txHash: bundlrTx.tags.txHash,
                chainIdFrom: bundlrTx.tags.chainIdFrom,
                nonce: bundlrTx.tags.nonce,
                chainIdTo: bundlrTx.tags.chainIdTo,
                bundlrTransactionId: bundlrTx.bundlrTransactionId,
            };
        });
        const result = signaturesData
            .filter((item) => !!item.signature)
            .map((signatureData) => {
            let validator = '';
            try {
                validator = this.web3.eth.accounts.recover(submissionId, signatureData.signature);
            }
            catch (e) {
                const error = e;
                context.logger.error(`[getSubmissionConfirmations] Error for erecover submissionId ${submissionId}, signature: ${signatureData.signature} error :${error.message}`);
            }
            return {
                ...signatureData,
                validator,
            };
        });
        return this.filterDuplicates(result);
    }
    /**
     * Get signed new asset confirmations transactions from arweave by debridgeId
     * @param debridgeId
     * @param context
     */
    getNewAssetConfirmationsByDebridgeId(debridgeId, context) {
        return this.getNewAssetConfirmations({ debridgeId }, context);
    }
    /**
     * Get signed new asset confirmations transactions from arweave by deployId
     * @param deployId
     * @param context
     */
    getNewAssetConfirmationsByDeployId(deployId, context) {
        return this.getNewAssetConfirmations({ deployId }, context);
    }
    /**
     * Get signed new asset confirmations transactions from arweave by tokenAddress
     * @param tokenAddress
     * @param nativeChainId
     * @param context
     */
    getNewAssetConfirmationsByTokenAddress(tokenAddress, nativeChainId, context) {
        return this.getNewAssetConfirmations({
            tokenAddress,
            nativeChainId: nativeChainId?.toString()
        }, context);
    }
    async getNewAssetConfirmations({ deployId, tokenAddress, nativeChainId, debridgeId, }, context) {
        const bundlrRequest = [];
        if (deployId) {
            bundlrRequest.push({ name: 'deployId', value: deployId });
        }
        if (debridgeId) {
            bundlrRequest.push({ name: 'debridgeId', value: debridgeId });
        }
        if (tokenAddress) {
            bundlrRequest.push({ name: 'tokenAddress', value: tokenAddress });
            bundlrRequest.push({ name: 'nativeChainId', value: nativeChainId });
        }
        const bundlrTxs = await this.arweaweConnector.getTxsByTags(bundlrRequest, context);
        const signaturesData = bundlrTxs.map((bundlrTx) => {
            return {
                signature: bundlrTx.tags?.signature,
                deployId: bundlrTx.tags.deployId,
                debridgeId: bundlrTx.tags.debridgeId,
                nativeChainId: bundlrTx.tags.nativeChainId,
                tokenDecimals: bundlrTx.tags.tokenDecimals,
                tokenName: bundlrTx.tags.tokenName,
                tokenSymbol: bundlrTx.tags.tokenSymbol,
                tokenAddress: bundlrTx.tags.tokenAddress,
                bundlrTransactionId: bundlrTx.bundlrTransactionId,
            };
        });
        const result = signaturesData
            .filter((item) => !!item.signature)
            .map((signatureData) => {
            let validator = '';
            try {
                validator = this.web3.eth.accounts.recover(signatureData.deployId, signatureData.signature);
            }
            catch (e) {
                const error = e;
                context.logger.error(`[getNewAssetConfirmations] Error for erecover deployId ${deployId}, signature: ${signatureData.signature}: error: ${error.message}`);
            }
            return {
                ...signatureData,
                validator,
            };
        });
        return this.filterDuplicates(result);
    }
    filterDuplicates(items) {
        const signaturesArray = [];
        const result = [];
        items.forEach((item) => {
            if (!signaturesArray.includes(item.signature)) {
                result.push(item);
                signaturesArray.push(item.signature);
            }
        });
        return result;
    }
}
//# sourceMappingURL=debridge-arweave.client.js.map