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
  // {"test": [1,2,3], "hi": 0, "third": {"yo": [2,3,4]}}
  // [1, "two", {"three": 4}, [1,2]]
  getNodeData = (node: DBNode, parentStruct?: ParentNode) => {
    // TODO: iterate on this w/ children and stack instead of recursive

    // TODO: don't need this declared on every iteration
    const _maybeInsertIntoParent = (
      value: NodeType,
      parent?: ParentNode,
      key?: string
    ) => {
      if (parent) {
        if (key) {
          // doesn't work w/ object in an array...
          (parent as ObjectParent)[key] = value;
        } else {
          (parent as ArrayParent).push(value);
        }
      }
      return parent;
    };
    if (!node.hasChildren) {
      // we are at a leaf node. leaf nodes have actual "value"s
      // if we don't have to give back the updated parent, just return the raw leaf node value
      return (
        _maybeInsertIntoParent(node.value, parentStruct, node.key) || node.value
      );
    } else {
      if (node.type == "Array") {
        const parentArray: ArrayParent = [];
        node.children.forEach((childID) => {
          const childNode = this.store[childID];
          // with each iteration, parentArray reference is getting updated
          // But we might also need to add it to the existing parent
          this.getNodeData(childNode, parentArray);
        });
        _maybeInsertIntoParent(parentArray, parentStruct, node.key);
        return parentArray;
      } else {
        // It's an object
        const parentObject: ObjectParent = {};
        node.children.forEach((childID) => {
          const childNode = this.store[childID];
          // with each iteration, parentObject reference is getting updated
          this.getNodeData(childNode, parentObject);
        });
        _maybeInsertIntoParent(parentObject, parentStruct, node.key);
        return parentObject;
      }
    }
  };

  getNode = (nodeID: string) => {
    // get the node with the ID
    // traverse tree and create arrays/objects as necessary
    const node = this.store[nodeID];
    // TODO: just need the DBNode instances to have access to the store...
    // I don't want any recursive traversal to happen until the property is accessed.
    node.data = (() => {
      // b/c it's anonymous and executed right away then .data calls won't force refresh from the store....
      // it'll just access the resulting value
      console.log("cached?", !!node.data);
      console.log("starting traversal");
      return this.getNodeData(node);
    })();
    return node;
  };

  // When clicking, we wanna show the next level of elements
  getChildren = (parentID: string) => {
    const node = this.store[parentID];
    if (!node.hasChildren) return [];
    return node.children.map((childID) => this.store[childID]);
  };
}
type ObjectParent = { [key: string]: NodeType };
type ArrayParent = Array<NodeType>;
type ParentNode = ArrayParent | ObjectParent;

export type NodeType =
  | ParentNode
  | String
  | Number
  | Boolean
  | Symbol
  | BigInt
  | null
  | undefined;

// Does not store nested objects, just references to children IDs
export class DBNode {
  key?: string;
  id: string;
  parentID?: string;
  private _children?: Array<string>;
  type;
  // TODO: this is a callback that will be injected at query time... better way to do this?
  // This callback gives each node access to the "global" store...
  // Can DBNode class be a subclass of MemoryDB and do this.store? Will each node have tons of data due to its storage
  // of 'this' ?
  data: NodeType;
  // TODO: only the leaf nodes should have a value. Value isn't always a primitive. could be empty object
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
