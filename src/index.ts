import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { middleware } from "@xzihnago/express-utils";
import "@/global";
import router from "@/router";
import routerWWW from "@/router/www";

const app = express();
app.set("trust proxy", 2);
app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  fileUpload({
    defParamCharset: "utf8",
  })
);

app.use(middleware.routeLog);
app.use(middleware.responseHandler);
app.use("/api", router);
app.use("/", routerWWW);

app.listen(process.env.PORT);
