import { Router } from "express";
import { middleware } from "@xzihnago/express-utils";
import { PermissionBits, user } from "@/middleware";

const router = Router();

router.get("/", (_, res) => {
  res.render("login");
});

router.get(
  "/search",
  user.authentication,
  user.permission(PermissionBits.SEARCH),
  (req, res) => {
    res.render("common", {
      permission: req.user.permissions,
      components: ["card-search", "card-searchResult"],
    });
  }
);

router.get(
  "/relation",
  user.authentication,
  user.permission(PermissionBits.EDIT_RELATION),
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
  user.authentication,
  user.permission(PermissionBits.MANAGE_DATABASE),
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

router.use(
  middleware.errorHandler.www(
    { 401: "/" },
    { 401: "登入逾時，請重新登入", 403: "權限不足" }
  )
);

export default router;
