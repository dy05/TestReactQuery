import ReactDOMServer from "react-dom/server.node.js";
import App from "./App.jsx";
import React from "react";
import Koa from "koa";

const app = new Koa();

app.use((ctx) => {
  const html = ReactDOMServer.renderToString(<App />);
  ctx.body = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ma page de test</title>
  <script type="module" src="http://localhost:3000/@vite/client"></script>
  <script type="module">
  import RefreshRuntime from "http://localhost:3000/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
  </script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" rel="stylesheet">
</head>
<body>
<div id="root">${html}</div>
<script type="module" src="http://localhost:3000/src/main.jsx?t=1639991946670"></script>
</body>
</html>`;
});
app.listen(8000);
