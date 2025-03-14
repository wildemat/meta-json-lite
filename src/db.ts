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
    // TODO: iteratively
    const insertNode = (data: NodeType, parentID?: string, key?: string) => {
      const dbNode = new DBNode(data, parentID, key);
      const { id } = dbNode;
      map[id] = dbNode;
      const childrenIDs: Array<string> = [];
      if (dbNode.hasChildren) {
        if (dbNode.type == "Array") {
          // TODO: better type inference
          Object.entries(data as ParentNode).forEach(([_, value]) => {
            const childID = insertNode(value, id);
            childrenIDs.push(childID);
          });
        } else if (dbNode.type == "Object") {
          Object.entries(data as ParentNode).forEach(([key, value]) => {
            const childID = insertNode(value, id, key);
            childrenIDs.push(childID);
          });
        }
      } else {
        dbNode.value = data;
        map[id] = dbNode;
      }
      dbNode.children = childrenIDs;
      return id;
    };
    insertNode(this.rawData);
    return map;
  }
}

const query = (nodeID: string) => {
  // get the node with the ID
  // traverse tree and create arrays/objects as necessary

  function serialize() {
    // Traverse and build out the object value.
    // TODO: cached retrieval
  }
  return {
    data: {},
    serialize,
  };
};

type ParentNode = Array<NodeType> | { [key: string]: NodeType };

export type NodeType =
  | (ParentNode & String)
  | Number
  | Boolean
  | Symbol
  | BigInt
  | null
  | undefined;

export class DBNode {
  key?: string;
  id: string;
  parentID?: string;
  private _children?: Array<string>;
  // TODO: only the leaf nodes should have a value. Value isn't always a primitive. could be empty object
  type;
  private _value?: NodeType;
  hasChildren: boolean;
  // TODO should there be a nodeID field
  constructor(nodeData: NodeType, parentID?: string, key?: string) {
    this.type = Object.prototype.toString
      .call(nodeData)
      .replace("[object ", "")
      .replace("]", "");
    this.parentID = parentID;
    this.key = key;
    this.hasChildren =
      (this.type == "Array" || this.type == "Object") &&
      !!Object.entries(nodeData as ParentNode).length;
    this.id = uuidv4();
  }

  set children(ids: Array<string>) {
    this._children = ids;
  }
  get children() {
    return this._children || [];
  }

  set value(value: NodeType) {
    this._value = value;
  }
  get value() {
    return this._value;
  }
}
