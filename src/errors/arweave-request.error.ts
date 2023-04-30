import {ArweaveClientError} from "./arweave-client.error";

export class ArweaveRequestError extends ArweaveClientError {
  constructor(message: string) {
    super(message, ArweaveRequestError.name);
  }
}