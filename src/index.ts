import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { rateLimit } from "express-rate-limit";
import middleware from "@xzihnago/middleware";
import "@/extensions";
import router from "@/router";
import routerWWW from "@/router/www";

const app = express();
app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser(process.env.HMAC_SECRET ?? ""));
app.use(
  fileUpload({
    defParamCharset: "utf8",
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  })
);
app.use(
  rateLimit({
    limit: 60,
    message: "操作頻率過高，請稍後再試",
    handler: (req, res, _, options) =>
      res.status(options.statusCode).send(`
        <script>
          alert("${options.message as string}");
          window.location.replace("${req.path}");
        </script>
      `),
  })
);

app.use(middleware.routeLog);
app.use(express.static("public"));
app.use("/api", router);
app.use("/", routerWWW);

try {
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  });
} catch (err) {
  console.log(err);
  process.exitCode = 1;
}
