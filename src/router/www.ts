import { Router } from "express";
import { middleware } from "@xzihnago/express-utils";
import { PermissionBits, user } from "@/middleware";

const router = Router();

router.get("/", (_, res) => {
  res.render("login");
});

router.get("/search", user.auth, user.parse, user.keepUp, (req, res) => {
  res.render("common", {
    permission: req.user.permissions,
    components: ["card-search", "card-searchResult"],
  });
});

router.get(
  "/relation",
  user.auth,
  user.parse,
  user.permission(PermissionBits.EDIT_RELATION),
  user.keepUp,
  (req, res) => {
    res.render("common", {
      permission: req.user.permissions,
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
  user.permission(PermissionBits.MANAGE_DATABASE),
  user.keepUp,
  (req, res) => {
    res.render("common", {
      permission: req.user.permissions,
      components: ["card-upload", "card-database"],
    });
  }
);

router.get(/.*/, (_, res) => {
  res.redirect("/");
});

router.use(middleware.errorHandler.www({ 401: "/" }));

export default router;
