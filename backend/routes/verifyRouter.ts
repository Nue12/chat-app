import express from "express";
import { showVerifyPage } from "../controllers/verifyController";

const verifyRouter = express.Router();

verifyRouter.get("/verify", showVerifyPage);

export { verifyRouter };
