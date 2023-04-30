type ArweaveConnectorItem = {
  bundlrTransactionId: string;
  validator: string;
  tags: Record<string, string>;
}

export type ArweaveConnectorResponse = ArweaveConnectorItem[];