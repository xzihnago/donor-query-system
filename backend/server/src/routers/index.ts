import { Hono } from "hono";
import routeApi from "@dqs/api";
import routeDocs from "./docs";

const router = new Hono();

router.route("/api", routeApi);
router.route("/", routeDocs);

export default router;
