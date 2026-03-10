import { Hono } from "hono";
import * as middleware from "@dqs/middleware";
import router from "./routers";

const app = new Hono();

app.onError(middleware.errorHandler);
app.use(middleware.logger);
app.route("/", router);

export default app;
