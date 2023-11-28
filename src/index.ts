import { app } from "./settings";
import { runDb } from "./db/db";

const port = process.env.PORT || 3010;

const startingApp = async () => {
  await runDb();
  app.listen(port, () => {});
};
startingApp().then(() => {
  console.log("listen port", port);
});

export { app };
