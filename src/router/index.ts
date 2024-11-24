import express from "express";
import middleware from "@xzihnago/middleware";
import userRoutes from "@/api/user/routes";
import donorRecordRoutes from "@/api/donorRecords/routes";
import donorRelationshipRoutes from "@/api/donorRelationship/routes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/donorRecords", donorRecordRoutes);
router.use("/donorRelationship", donorRelationshipRoutes);

router.use(middleware.errorHandler.api);

export default router;
