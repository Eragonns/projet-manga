import app from "./src/app.js";

const port = 5000;

app.listen(port, () =>
  console.log(`Le serveur s'exécute sur http://localhost:${port}`)
);
