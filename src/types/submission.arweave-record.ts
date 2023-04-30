import {SignatureRecord} from "./signature.record";

export class SubmissionArweaveRecord extends SignatureRecord {
  submissionId: string;
  txHash: string;
  chainIdFrom: string;
  nonce: string;
  chainIdTo: string;
  bundlrTransactionId: string;
}