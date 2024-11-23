import { Router } from "express";
import middleware from "@xzihnago/middleware";
import { user } from "@/middleware";

const router = Router();

router.get("/", (_, res) => {
  res.render("login");
});

router.get(
  "/search",
  middleware.authentication.jwt(process.env.HMAC_SECRET ?? ""),
  user.parse,
  user.keepUp,
  (req, res) => {
    res.render("common", {
      admin: req.user.admin,
      components: ["card-search", "card-searchResult"],
    });
  }
);

router.get(
  "/relation",
  middleware.authentication.jwt(process.env.HMAC_SECRET ?? ""),
  user.parse,
  user.permission,
  user.keepUp,
  (_, res) => {
    res.render("common", {
      admin: true,
      components: [
        "card-relationChief",
        "card-relationMember",
        "card-relationResult",
      ],
    });
  }
);

router.get(
  "/upload",
  middleware.authentication.jwt(process.env.HMAC_SECRET ?? ""),
  user.parse,
  user.permission,
  user.keepUp,
  (_, res) => {
    res.render("common", { admin: true, components: ["card-upload"] });
  }
);

router.get(/.*/, (_, res) => {
  res.redirect("/");
});

router.use(middleware.errorHandler.www({ 401: "/" }));

export default router;
