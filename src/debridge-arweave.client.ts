import { ArweaveConnector } from "./arweave.connector";
import { SignatureRecord }  from "./types/signature.record";
import { Context } from "./types/context";
import Web3 from "web3";
import { SubmissionArweaveRecord } from "./types/submission.arweave-record";
import { AssetConfirmationArweaveRecord } from "./types/asset.confirmation.arweave-record";
import { ArweaweTag } from "./types/arweawe.tag";
import { FindNewAssetRequest } from "./types/find.new.asset.request";

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
export class DebridgeArweaveClient {

  private readonly arweaweConnector: ArweaveConnector;
  private readonly web3: Web3 = new Web3();
  private readonly validatorNames = new Map<string, string>();

  constructor(arweaveNode: string, validators: ValidatorConfig[]) {
    this.arweaweConnector = new ArweaveConnector(arweaveNode, validators.map(validator => validator.arweave));
    validators.forEach(validator => {
      this.validatorNames.set(validator.validator, validator.name);
    });
  }

  /**
   * Get signed submission transactions from arweave by id
   * @param submissionId
   * @param context
   */
  async getSubmissionConfirmations(submissionId: string, context: Context): Promise<SubmissionArweaveRecord[]> {
    const bundlrTxs = await this.arweaweConnector.getTxsByTags(
      [{ name: 'submissionId', value: submissionId }],
      context,
    );

    const signaturesData = bundlrTxs.map((bundlrTx) => {
      return {
        signature: bundlrTx.tags?.signature,
        submissionId: bundlrTx.tags.submissionId,
        txHash: bundlrTx.tags.txHash,
        chainIdFrom: bundlrTx.tags.chainIdFrom,
        nonce: bundlrTx.tags.nonce,
        chainIdTo: bundlrTx.tags.chainIdTo,
        bundlrTransactionId: bundlrTx.bundlrTransactionId,
      } as SubmissionArweaveRecord;
    });

    const result = signaturesData
      .filter((item) => !!item.signature)
      .map((signatureData) => {
        let validator = '';
        try {
          validator = this.web3.eth.accounts.recover(
            submissionId,
            signatureData.signature,
          );
        } catch (e) {
          const error = e as Error;
          context.logger.error(`[getSubmissionConfirmations] Error for erecover submissionId ${submissionId}, signature: ${signatureData.signature} error :${error.message}`);
        }
        return {
          ...signatureData,
          validator,
          validatorName: this.validatorNames.get(validator)!
        };
      });

    return this.filterDuplicates(result);
  }

  /**
   * Get signed new asset confirmations transactions from arweave by debridgeId
   * @param debridgeId
   * @param context
   */
  getNewAssetConfirmationsByDebridgeId(debridgeId: string, context: Context): Promise<AssetConfirmationArweaveRecord[]> {
    return this.getNewAssetConfirmations({ debridgeId }, context);
  }

  /**
   * Get signed new asset confirmations transactions from arweave by deployId
   * @param deployId
   * @param context
   */
  getNewAssetConfirmationsByDeployId(deployId: string, context: Context): Promise<AssetConfirmationArweaveRecord[]> {
    return this.getNewAssetConfirmations({ deployId }, context);
  }

  /**
   * Get signed new asset confirmations transactions from arweave by tokenAddress
   * @param tokenAddress
   * @param nativeChainId
   * @param context
   */
  getNewAssetConfirmationsByTokenAddress(tokenAddress: string, nativeChainId: number, context: Context): Promise<AssetConfirmationArweaveRecord[]> {
    return this.getNewAssetConfirmations({
      tokenAddress,
      nativeChainId: nativeChainId?.toString()
    }, context);
  }

  private async getNewAssetConfirmations({
                                   deployId,
                                   tokenAddress,
                                   nativeChainId,
                                   debridgeId,
                                 }: FindNewAssetRequest, context: Context): Promise<AssetConfirmationArweaveRecord[]> {
    const bundlrRequest: ArweaweTag[] = [];
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
    const bundlrTxs = await this.arweaweConnector.getTxsByTags(
      bundlrRequest,
      context,
    );

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
        } as AssetConfirmationArweaveRecord;
      });

    const result = signaturesData
      .filter((item) => !!item.signature)
      .map((signatureData) => {
        let validator = '';
        try {
          validator = this.web3.eth.accounts.recover(
            signatureData.deployId,
            signatureData.signature,
          );
        } catch (e) {
          const error = e as Error;
          context.logger.error(`[getNewAssetConfirmations] Error for erecover deployId ${deployId}, signature: ${signatureData.signature}: error: ${error.message}`);
        }
        return {
          ...signatureData,
          validator,
          validatorName: this.validatorNames.get(validator)!
        };
      });

    return this.filterDuplicates(result);
  }

  private filterDuplicates<T extends SignatureRecord>(items: T[]): T[] {
    const signaturesArray: string[] = [];
    const result: T[] = [];
    items.forEach((item) => {
      if (!signaturesArray.includes(item.signature)) {
        result.push(item);
        signaturesArray.push(item.signature);
      }
    });
    return result;
  }
}