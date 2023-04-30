"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionArweaveRecord = void 0;
const signature_record_1 = require("./signature.record");
class SubmissionArweaveRecord extends signature_record_1.SignatureRecord {
    submissionId;
    txHash;
    chainIdFrom;
    nonce;
    chainIdTo;
    bundlrTransactionId;
}
exports.SubmissionArweaveRecord = SubmissionArweaveRecord;
//# sourceMappingURL=submission.arweave-record.js.map