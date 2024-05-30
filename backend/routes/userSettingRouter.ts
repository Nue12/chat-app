import express from "express";
import {
  showUserSetting,
  uploadUserProfile,
} from "../controllers/userSettingController";
import multer from "multer";
import { v4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req: any, file: Express.Multer.File, cb: any) {
    cb(null, `assets`);
  },

  filename: function (req: any, file: Express.Multer.File, cb: any) {
    const extension = file.mimetype.split("/")[1];
    cb(null, v4() + "." + extension);
  },
});

const upload = multer({ storage: storage });

const userSettingRouter = express.Router();

userSettingRouter.get("/setting", showUserSetting);

userSettingRouter.post(
  "/uploadProfile/:userId",
  upload.single("profile_img"),
  uploadUserProfile
);

export { userSettingRouter };
