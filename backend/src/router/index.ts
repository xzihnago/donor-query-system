import express from "express";
import { middleware } from "@xzihnago/express-utils";
import routeUsers from "@/api/users/routes";
import routeDonors from "@/api/donors/routes";
import routeDonorsRecords from "@/api/donors-records/routes";
import routeDonorsRelations from "@/api/donors-relations/routes";

const router = express.Router();

router.use("/users", routeUsers);
router.use("/donors", routeDonors);
router.use("/donors/records", routeDonorsRecords);
router.use("/donors/relations", routeDonorsRelations);

router.use(middleware.errorHandler.api);

export default router;
