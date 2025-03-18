type ArweaveConnectorItem = {
  arweaveTransactionId: string;
  validator: string;
  tags: Record<string, string>;
}

export type ArweaveConnectorResponse = ArweaveConnectorItem[];