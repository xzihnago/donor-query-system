import express from "express";
import middleware from "@xzihnago/middleware";
import userRoutes from "@/api/user/routes";
import donorRecordRoutes from "@/api/donorRecords/routes";
import donorRelationsRoutes from "@/api/donorRelations/routes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/donorRecords", donorRecordRoutes);
router.use("/donorRelations", donorRelationsRoutes);

router.use(middleware.errorHandler.api);

export default router;
