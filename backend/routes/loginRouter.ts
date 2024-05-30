import express from "express";
import {
  checkKey,
  isAuthencate,
  showLoginPage,
} from "../controllers/loginController";
const loginRouter = express.Router();

loginRouter.get("/login", showLoginPage);

loginRouter.post("/checkKey", checkKey);

loginRouter.post("/isAuthencate", isAuthencate);

export { loginRouter };
