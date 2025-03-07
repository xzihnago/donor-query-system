import express from "express";
import { middleware } from "@xzihnago/express-utils";
import userRoutes from "@/api/user/routes";
import donorRoutes from "@/api/donor/routes";
import donorRecordRoutes from "@/api/donorRecords/routes";
import donorRelationsRoutes from "@/api/donorRelations/routes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/donor", donorRoutes);
router.use("/donorRecords", donorRecordRoutes);
router.use("/donorRelations", donorRelationsRoutes);

router.use(middleware.errorHandler.api);

export default router;
