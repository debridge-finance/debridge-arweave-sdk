import {ArweaweTag} from "./arweawe.tag";

export type ArweaweResponse  = {
  transactions: ArweaweResponseTransactions;
};

type ArweaweResponseTransactions = {
  edges: ArweaweResponseEdges[];
};

type ArweaweResponseEdges = {
  node: ArweaweResponseNode;
};
class ArweaweResponseNode {
  id: string;
  owner: {
    address: string;
  };
  tags: ArweaweTag[];
}