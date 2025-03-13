"use strict";
import { createRoot } from "react-dom/client";
import { InputText, ParseButton } from "./input";
import { useRef } from "react";

const App = () => {
  const textRef = useRef(
    '{"test": [1,2,3], "hi": 0, "third": {"yo": [2,3,4]}}'
  );
  return (
    <div>
      <p>
        Samples: <br />
        {'{"test": [1,2,3], "hi": 0, "third": {"yo": [2,3,4]}}'} <br />
        {'[1, "two", {"three": 4}, [1,2]]'}
        <br />
        {1}
        <br />
        {"two"}
        <br />
      </p>
      <p>Hello World</p>
      <InputText ref={textRef} />
      <ParseButton ref={textRef} />
    </div>
  );
};

// Render the App component to the DOM
const container = document.querySelector("#root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
