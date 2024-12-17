import app from "./src/app.js";

const port = process.env.PORT;

app.listen(port, () =>
  console.log(`Le serveur s'exécute sur http://localhost:${port}`)
);
