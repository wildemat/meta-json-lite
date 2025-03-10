import React, { ReactEventHandler, useState } from "react";

export const InputText: React.FC<{
  ref: React.RefObject<string>;
}> = ({ ref }) => {
  const [text, setText] = useState<string>("");
  const updateText = (e: any) => {
    const value = e.target.value;
    setText(value);
    ref.current = value;
  };
  return (
    <>
      <textarea value={text} onChange={updateText} />
    </>
  );
};

export const ParseButton: React.FC<{
  ref: React.RefObject<string>;
}> = ({ ref }) => {
  console.log("render button");
  const [parsed, setParsed] = useState({});
  const onClick: ReactEventHandler = (e) => {
    e.stopPropagation();
    try {
      setParsed(JSON.parse(ref.current));
    } catch {
      alert("Bad json");
    }
  };
  return (
    <>
      <button onClick={onClick}>Parse</button>
      <p>{JSON.stringify(parsed)}</p>
    </>
  );
};
