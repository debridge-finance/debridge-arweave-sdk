import { ArweaveConnector } from "./arweave.connector";
import { SignatureRecord }  from "./types/signature.record";
import { Context } from "./types/context";
import Web3 from "web3";
import { SubmissionArweaveRecord } from "./types/submission.arweave-record";
import { AssetConfirmationArweaveRecord } from "./types/asset.confirmation.arweave-record";
import { ArweaveTag } from "./types/arweave.tag";
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

  private readonly arweaveConnector: ArweaveConnector;
  private readonly web3: Web3 = new Web3();
  private readonly validatorNames = new Map<string, string>();

  constructor(arweaveNode: string, validators: ValidatorConfig[]) {
    this.arweaveConnector = new ArweaveConnector(arweaveNode, validators.map(validator => validator.arweave));
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
    const arweaveTxs = await this.arweaveConnector.getTxsByTags(
      [{ name: 'submissionId', value: submissionId }],
      context,
    );

    const signaturesData = arweaveTxs.map((tx) => {
      return {
        signature: tx.tags?.signature,
        submissionId: tx.tags.submissionId,
        txHash: tx.tags.txHash,
        chainIdFrom: tx.tags.chainIdFrom,
        nonce: tx.tags.nonce,
        chainIdTo: tx.tags.chainIdTo,
        arweaveTransactionId: tx.arweaveTransactionId,
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
    const arweaveRequest: ArweaveTag[] = [];
    if (deployId) {
      arweaveRequest.push({ name: 'deployId', value: deployId });
    }
    if (debridgeId) {
      arweaveRequest.push({ name: 'debridgeId', value: debridgeId });
    }
    if (tokenAddress) {
      arweaveRequest.push({ name: 'tokenAddress', value: tokenAddress });
      arweaveRequest.push({ name: 'nativeChainId', value: nativeChainId });
    }
    const arweaveTxs = await this.arweaveConnector.getTxsByTags(
      arweaveRequest,
      context,
    );

    const signaturesData = arweaveTxs.map((tx) => {
        return {
          signature: tx.tags?.signature,
          deployId: tx.tags.deployId,
          debridgeId: tx.tags.debridgeId,
          nativeChainId: tx.tags.nativeChainId,
          tokenDecimals: tx.tags.tokenDecimals,
          tokenName: tx.tags.tokenName,
          tokenSymbol: tx.tags.tokenSymbol,
          tokenAddress: tx.tags.tokenAddress,
          arweaveTransactionId: tx.arweaveTransactionId,
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