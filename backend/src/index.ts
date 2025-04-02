import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { middleware } from "@xzihnago/express-utils";
import "@/global";
import router from "@/router";
import routerWWW from "@/router/www";

const app = express();
app.set("trust proxy", 2);
app.set("view engine", "ejs");

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json({ limit: "1mb" }));

app.use(middleware.routeLogger);
app.use(middleware.responseHandler);
app.use("/api", router);
app.use("/", routerWWW);

app.listen(process.env.PORT);
