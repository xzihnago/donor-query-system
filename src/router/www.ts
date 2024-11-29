import { Router } from "express";
import middleware from "@xzihnago/middleware";
import { user } from "@/middleware";

const router = Router();

router.get("/", (_, res) => {
  res.render("login");
});

router.get("/search", user.auth, user.parse, user.keepUp, (req, res) => {
  res.render("common", {
    admin: req.user.admin,
    components: ["card-search", "card-searchResult"],
  });
});

router.get(
  "/relation",
  user.auth,
  user.parse,
  user.permission,
  user.keepUp,
  (_, res) => {
    res.render("common", {
      admin: true,
      components: [
        "card-relationSuperior",
        "card-relationInferior",
        "card-relationPreview",
      ],
    });
  }
);

router.get(
  "/upload",
  user.auth,
  user.parse,
  user.permission,
  user.keepUp,
  (_, res) => {
    res.render("common", {
      admin: true,
      components: ["card-upload", "card-export"],
    });
  }
);

router.get(/.*/, (_, res) => {
  res.redirect("/");
});

router.use(middleware.errorHandler.www({ 401: "/" }));

export default router;
