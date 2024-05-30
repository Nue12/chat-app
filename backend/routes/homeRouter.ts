import express from "express";
import { showHomePage } from "../controllers/HomeController";
const homeRouter = express.Router();

homeRouter.get("/chat", showHomePage);

export { homeRouter };
