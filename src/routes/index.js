import express from "express";
import { financeRoutes } from "./finance";

function getRoutes() {
  const router = express.Router();

  router.use("/finance", financeRoutes());

  return router;
}

export { getRoutes };
