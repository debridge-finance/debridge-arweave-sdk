# debridge-arweave-sdk
SDK for finding all signatures by submission ID in the Arweave network (stored by Bunldr) and performing web3 erecover() for validating the signatures. 
The SDK supports searching only for transactions that were created by specific addresses. The same for searching new assets by tokenName, deployId, debridgeId.

# How to use

```typescript
const nodeUrl = 'https://arweave.net';
const txOwners = ['123', 'abc']; //arweave addreses
const client = new DebridgeArweaveClient(nodeUrl, txOwners);
```

For using a sdk you should have a context that contains logger(see types).

Get signatures by submission id:
```typescript
client.getSubmissionConfirmations('0xcaa800ead1e369cae024dda4b46716674f88807416e7581a939d4f05db4002f4', context)
```

Get signatures by deployId:
```typescript
client.getNewAssetConfirmationsByDeployId('0xf9eb884a4467455325ead9c5c945f29af4c5f9e9731c28d9a379a69e0de30fee', context)
```

Get signatures by tokenAddress:
```typescript
client.getNewAssetConfirmationsByTokenAddress(
  '0x069b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001',
  7565164,//nativeChainId
  context)
```


Get signatures by debridgeId:
```typescript
client.getNewAssetConfirmationsByDebridgeId('0x15db45753160f76964dfa867510c9ede0ac87ac9ce24771de7efa0dab8251c1a', context)
```