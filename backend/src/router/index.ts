import express from "express";
import { middleware } from "@xzihnago/express-utils";
import userRoutes from "@/api/user/routes";
import donorRoutes from "@/api/donor/routes";
import donorRecordRoutes from "@/api/donor-record/routes";
import donorRelationsRoutes from "@/api/donor-relations/routes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/donor", donorRoutes);
router.use("/donor-record", donorRecordRoutes);
router.use("/donor-relations", donorRelationsRoutes);

router.use(middleware.errorHandler.api);

export default router;
