import { Hono } from "hono";
import routeUsers from "./users";
import routeDonors from "./donors";
import routeDonorsRecords from "./donors-records";
import routeDonorsRelations from "./donors-relations";

const router = new Hono();

router.route("/users", routeUsers);
router.route("/donors", routeDonors);
router.route("/donors/records", routeDonorsRecords);
router.route("/donors/relations", routeDonorsRelations);

export default router;
