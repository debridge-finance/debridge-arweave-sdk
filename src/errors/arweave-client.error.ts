export class ArweaveClientError extends Error {
  constructor(message: string, private readonly type: string) {
    super(message);
  }
}