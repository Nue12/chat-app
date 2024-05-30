import express from "express";
import {
  registerUser,
  showRegister,
  verifiedEmail,
} from "../controllers/registerController";

const registerRouter = express.Router();

registerRouter.get("/register", showRegister);
registerRouter.post("/registerUser", registerUser);
registerRouter.post("/verifiedEmail", verifiedEmail);

export { registerRouter };
