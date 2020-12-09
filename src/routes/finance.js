import express from "express";
import { getAnalysis } from "../controller/analysis";
import { getNews } from "../controller/news";

export const financeRoutes = () => {
  const router = express.Router();

  router.get("/analysis", getAnalysis);
  router.get("/news", getNews);

  return router;
};
