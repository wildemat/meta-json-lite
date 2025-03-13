import { v4 as uuidv4 } from "uuid";

export class MemoryDB {
  private rawData;
  store;

  constructor(parsedJson: any) {
    this.rawData = parsedJson;
    this.store = this.buildStore();
  }

  buildStore() {
    const map: { [key: string]: DBNode } = {};
    const rootNode = new DBNode(this.rawData);
    // TODO: iteratively
    const insertNode = (dbNode: DBNode) => {
      const nodeID = this.generateUUID();
      const { type } = dbNode;
      // TODO: the store doesn't need the _value of the node. Values can be built by traversing the
      // tree and creating objects/arrays based on children and keys etc.
      map[nodeID] = dbNode;
      const childrenIDs: Array<string> = [];
      if (type == "Array") {
        (dbNode.children as Array<NodeType>).forEach((child) => {
          const childNode = new DBNode(child, nodeID);
          // TODO: don't need this if new DBNode generates an ID
          const grandchildID = insertNode(childNode);
          childrenIDs.push(grandchildID);
        });
      } else if (type == "Object") {
        (dbNode.children as Array<[string, NodeType]>).forEach(
          ([key, value]) => {
            const childNode = new DBNode(value, nodeID, key);
            const grandchildID = insertNode(childNode);
            childrenIDs.push(grandchildID);
          }
        );
      } else {
        map[nodeID] = dbNode;
      }
      dbNode.setChildIDs(childrenIDs);
      return nodeID;
    };
    insertNode(rootNode);
    return map;
  }

  generateUUID(): string {
    return uuidv4();
  }
}

const queryStore = (nodeID: string) => {
  // get the node with the ID
  // traverse tree and create arrays/objects as necessary
};

export type NodeType = Array<any> | Object | String | Number;
export class DBNode {
  _key?: string;
  _value;
  _parentID?: string;
  // TODO: should _children just be array of nodeIDs
  _children?: Array<NodeType>;
  childrenIDs?: Array<string>;
  type;
  // TODO should there be a nodeID field
  constructor(nodeData: NodeType, parentID?: string, key?: string) {
    this._value = nodeData;
    this.type = Object.prototype.toString
      .call(this._value)
      .replace("[object ", "")
      .replace("]", "");
    this._parentID = parentID;
    this._key = key;
  }
  setChildIDs(ids: Array<string>) {
    this.childrenIDs = ids;
  }
  toString() {
    return JSON.stringify(this._value);
  }
  hasChildren() {
    return (
      this.type == "Array" ||
      (this.type == "Object" && Object.entries(this._value).length)
    );
  }
  get children() {
    if (!this.hasChildren()) return [];
    return this.type == "Array" ? this._value : Object.entries(this._value);
  }
}
