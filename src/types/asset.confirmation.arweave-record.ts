import {SignatureRecord} from "./signature.record";

export class AssetConfirmationArweaveRecord extends SignatureRecord {
  deployId: string;
  debridgeId: string;
  nativeChainId: string;
  tokenDecimals: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  bundlrTransactionId: string;
}