import React, { ReactEventHandler, useState } from "react";
import { DBNode, MemoryDB, NodeType } from "./db";

export const InputText: React.FC<{
  ref: React.RefObject<string>;
}> = ({ ref }) => {
  const [text, setText] = useState<string>(ref.current);
  const updateText = (e: any) => {
    const value = e.target.value;
    setText(value);
    ref.current = value;
  };
  return (
    <>
      <textarea value={text} onChange={updateText} />
      <br />
    </>
  );
};

export const ParseButton: React.FC<{
  ref: React.RefObject<string>;
}> = ({ ref }) => {
  console.log("render button", ref.current);
  // TODO: type inference
  const [rootData, setRootData] = useState<any>();
  const onClick: ReactEventHandler = (e) => {
    e.stopPropagation();
    try {
      const data = JSON.parse(ref.current);
      setRootData(data);
      const store = new MemoryDB(data);
      console.log(store);
    } catch (e) {
      console.log("err", e);
      alert("Bad json");
    }
  };
  return (
    <>
      <button onClick={onClick}>Parse</button>
      <TypedNode data={rootData} />
    </>
  );
};

const TypedNode = ({ data }: { data: NodeType }) => {
  if (data == undefined) return <>Nothing</>;
  const node = new DBNode(data);
  const type = node.type;
  return type == "Array" ? (
    <ArrayNode value={data} />
  ) : type == "Object" ? (
    <ObjectNode value={data} />
  ) : (
    <PrimitiveNode value={data} />
  );
};

const PrimitiveNode = ({ value }: any) => {
  console.log("primitive node", value);
  return <span>{value.toString()}</span>;
};

const ArrayNode = ({ value }: any) => {
  const myNode = new DBNode(value);
  return <span>ArrayNode {myNode.type}</span>;
};

const ObjectNode = ({ name, value }: { name?: string; value: NodeType }) => {
  const [children, setChildren] = useState<any>([]);
  const onClick = () => {
    const nodes: any = [];
    Object.entries(value).forEach(([key, value]) => {
      // Stick children in an outlet
      // const node = new Node(value);
      nodes.push({ key, element: <TypedNode data={value} /> });
      // console.log(key, node.type);
    });
    setChildren(nodes);
  };
  return (
    <span>
      {name && <div>key: {name}</div>}
      <button onClick={onClick}>ObjectNode</button>
      {children.map(({ key, element }) => {
        return (
          <>
            <p>key: {key}</p>
            {element}
          </>
        );
      })}
    </span>
  );
};
