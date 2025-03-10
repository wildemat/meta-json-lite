"use strict";
import { createRoot } from "react-dom/client";
import { InputText, ParseButton } from "./input";
import { useRef } from "react";

const App = () => {
  const textRef = useRef("");
  return (
    <div>
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
