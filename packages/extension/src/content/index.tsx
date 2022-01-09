import { registerSendMessage } from "@wrp/core/es/injection/extension";
import { sendEventMessage } from "./message";
import { render } from "react-dom";
import App from "./App";
import createCache from "@emotion/cache";
import { CacheProvider, jsx, css } from "@emotion/react";

registerSendMessage(sendEventMessage);

function createApp() {
  let root = document.querySelector("#deep-reading-root");
  if (root === null) {
    root = document.createElement("div");
    root.id = "deep-reading-root";
    document.body.appendChild(root);
  }
  root.setAttribute("wrp-action", "no-look-up");

  const shadowRoot = root.attachShadow({ mode: "open" });
  const reactRoot = document.createElement("div");
  reactRoot.id = "react-root";
  const otherRoot = document.createElement("div");
  otherRoot.id = "other-root";

  shadowRoot.appendChild(otherRoot);
  shadowRoot.appendChild(reactRoot);

  const myCache = createCache({
    key: "deep-reading",
    stylisPlugins: [],
    container: otherRoot,
  });

  render(
    <CacheProvider value={myCache}>
      <App />
    </CacheProvider>,
    reactRoot
  );
}

createApp();

console.log("content.js");
