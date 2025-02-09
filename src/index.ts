import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { middleware } from "@xzihnago/express-utils";
import "@/global";
import router from "@/router";
import routerWWW from "@/router/www";

const app = express();
app.set("trust proxy", 1);
app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET ?? ""));
app.use(
  fileUpload({
    defParamCharset: "utf8",
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

app.use(middleware.routeLog);
app.use(middleware.responseHandler);
app.use(express.static("public"));
app.use("/api", router);
app.use("/", routerWWW);

try {
  app.listen(process.env.PORT ?? 3000, () => {
    console.log(`http://localhost:${process.env.PORT ?? "3000"}`);
  });
} catch (err) {
  console.log(err);
  process.exitCode = 1;
}
