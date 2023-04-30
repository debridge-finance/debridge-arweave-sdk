"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetConfirmationArweaveRecord = void 0;
const signature_record_1 = require("./signature.record");
class AssetConfirmationArweaveRecord extends signature_record_1.SignatureRecord {
    deployId;
    debridgeId;
    nativeChainId;
    tokenDecimals;
    tokenName;
    tokenSymbol;
    tokenAddress;
    bundlrTransactionId;
}
exports.AssetConfirmationArweaveRecord = AssetConfirmationArweaveRecord;
//# sourceMappingURL=asset.confirmation.arweave-record.js.map