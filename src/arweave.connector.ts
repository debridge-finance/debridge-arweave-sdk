import { ArweaweTag } from "./types/arweawe.tag";
import { Context } from "./types/context";
import { ArweaveRequestError } from "./errors/arweave-request.error";
import { ArweaweResponse } from "./types/arweawe.response";
import { ArweaveConnectorResponse } from "./types/arweave.connector-response";

/**
 * ArweaveConnector request arweave node for getting data from arweave using thegraph
 * For creating instance of ArweaveConnector you should to put arweaveNode and txOwners.
 * txOwners is variables for setuping a list of tx owners. Its important for avoiding spam messages.
 */
export class ArweaveConnector {

  constructor(private readonly arweaveNode: string, private readonly txOwners: string[]) {
  }

  /**
   * Get tx info by tags
   * @param tags
   * @param context
   */
  async getTxsByTags(tags:  ArweaweTag[], context: Context): Promise<ArweaveConnectorResponse> {
    context.logger.log(`getTxsByTags is started`);
    const body = this.generateQueryWithTags(
      tags.filter((tag) => !!tag.value),
    );
    context.logger.log(`query ${JSON.stringify(body)}`);
    const response = await fetch(`${this.arweaveNode}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    if (response.status !== 200) {
      throw new ArweaveRequestError(`Can not download result from arweave`);
    }
    const text = await response.text();
    const parsedResponse = JSON.parse(text).data as ArweaweResponse;
    const result = parsedResponse.transactions.edges.map(({ node }) => {
      return {
        bundlrTransactionId: node.id,
        validator: node.owner.address,
        tags: node.tags.reduce((previous: Record<string, string>, current: ArweaweTag) => {
          if (current.value != null) {
            previous[current.name] = current.value;
          }
          return previous;
        }, {}),
      };
    });
    context.logger.log(`result ${JSON.stringify(result)}`);
    context.logger.log(`getTxsByTags is finished`);
    return result as ArweaveConnectorResponse;
  }

  private generateQueryWithTags(
    tags: ArweaweTag[],
  ): string {
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