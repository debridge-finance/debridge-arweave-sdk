"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArweaveConnector = void 0;
const arweave_request_error_1 = require("./errors/arweave-request.error");
/**
 * ArweaveConnector request arweave node for getting data from arweave using thegraph
 * For creating instance of ArweaveConnector you should to put arweaveNode and txOwners.
 * txOwners is variables for setuping a list of tx owners. Its important for avoiding spam messages.
 */
class ArweaveConnector {
    arweaveNode;
    txOwners;
    constructor(arweaveNode, txOwners) {
        this.arweaveNode = arweaveNode;
        this.txOwners = txOwners;
    }
    /**
     * Get tx info by tags
     * @param tags
     * @param context
     */
    async getTxsByTags(tags, context) {
        context.logger.log(`getTxsByTags is started`);
        const body = this.generateQueryWithTags(tags.filter((tag) => !!tag.value));
        context.logger.log(`query ${JSON.stringify(body)}`);
        const response = await fetch(`${this.arweaveNode}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body,
        });
        if (response.status !== 200) {
            throw new arweave_request_error_1.ArweaveRequestError(`Can not download result from arweave`);
        }
        const text = await response.text();
        const parsedResponse = JSON.parse(text).data;
        const result = parsedResponse.transactions.edges.map(({ node }) => {
            return {
                bundlrTransactionId: node.id,
                validator: node.owner.address,
                tags: node.tags.reduce((previous, current) => {
                    if (current.value != null) {
                        previous[current.name] = current.value;
                    }
                    return previous;
                }, {}),
            };
        });
        context.logger.log(`result ${JSON.stringify(result)}`);
        context.logger.log(`getTxsByTags is finished`);
        return result;
    }
    generateQueryWithTags(tags) {
        const query = `{  
        transactions(
          tags: ${JSON.stringify(tags)},
          owners: ${JSON.stringify(this.txOwners)}
        ) {    
            edges {      
              node {       
                id   
                owner { address } 
                tags { 
                  name 
                  value 
                }    
              }    
            }  
          } 
        }`
            .replaceAll(`"name"`, 'name')
            .replaceAll(`"value"`, 'values');
        return JSON.stringify({
            query: query,
        });
    }
}
exports.ArweaveConnector = ArweaveConnector;
//# sourceMappingURL=arweave.connector.js.map