import { Request, Response } from "express";
import { join } from "path";
import { writeFileSync } from "fs";
import { usersModel } from "../models/users";

const showUserSetting = (req: Request, res: Response) => {
  res.sendFile(
    join(
      __dirname,
      "..",
      "..",
      "frontend",
      "src",
      "pages",
      "userSetting",
      "userSetting.html"
    )
  );
};

const uploadUserProfile = (req: Request, res: Response) => {
  if (req.file) {
    const userId = req.params.userId;
    const profileUrl = req.file.filename;

    const updatedUsersArray = usersModel
      .getUsersData()
      .map((user) =>
        user.id === userId ? { ...user, userImg: profileUrl } : user
      );

    usersModel.setUsersData(updatedUsersArray);

    res.status(200).json({ url: profileUrl });
  } else {
    res.status(400).json({ message: "Error uploading profile!" });
  }
};

export { showUserSetting, uploadUserProfile };
