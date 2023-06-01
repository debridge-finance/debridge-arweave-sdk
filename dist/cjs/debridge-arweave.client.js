"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebridgeArweaveClient = void 0;
const tslib_1 = require("tslib");
const arweave_connector_1 = require("./arweave.connector");
const web3_1 = tslib_1.__importDefault(require("web3"));
/**
 * DebridgeArweaveClient is a class for receiving debridge transactions from arweave.
 * For creating instance of ArweaveConnector you should to put arweaveNode and txOwners.
 * txOwners is variables for setuping a list of tx owners. Its important for avoiding spam messages.
 */
class DebridgeArweaveClient {
    arweaweConnector;
    web3 = new web3_1.default();
    validatorNames = new Map();
    constructor(arweaveNode, validators) {
        this.arweaweConnector = new arweave_connector_1.ArweaveConnector(arweaveNode, validators.map(validator => validator.arweave));
        validators.forEach(validator => {
            this.validatorNames.set(validator.validator, validator.name);
        });
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
                validatorName: this.validatorNames.get(validator)
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
                validatorName: this.validatorNames.get(validator)
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
exports.DebridgeArweaveClient = DebridgeArweaveClient;
//# sourceMappingURL=debridge-arweave.client.js.map