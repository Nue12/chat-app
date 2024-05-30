import { Request, Response } from "express";
import { join } from "path";
import { v4 } from "uuid";
import { keys } from "../models/key";
import { usersModel } from "../models/users";

const showLoginPage = (req: Request, res: Response) => {
  const url = join(
    __dirname,
    "..",
    "..",
    "frontend",
    "src",
    "pages",
    "login",
    "login.html"
  );

  return res.sendFile(url);
};

interface RequestKey {
  key: string;
}
const checkKey = (req: Request, res: Response) => {
  const reqKey: RequestKey = req.body;
  const hasKey = keys.some((key) => {
    return key.key === reqKey.key;
  });
  if (hasKey) {
    res.end();
  } else {
    res.redirect("/login");
  }
};

interface RequestIsAuthencate {
  name: string;
  password: string;
}

interface ResponseIsAuthencate {
  status: "success" | "fail";
  message: string;
  key?: string;
  userId?: string;
  userName?: string;
  userImg?: string;
}

const isAuthencate = (req: Request, res: Response) => {
  const { name, password }: RequestIsAuthencate = req.body;

  const foundUser = usersModel
    .getUsersData()
    .find((user) => user.name === name && user.password === password);

  if (!foundUser) {
    const response: ResponseIsAuthencate = {
      status: "fail",
      message: "user & password are not exits",
    };

    return res.status(404).json(response);
  }

  const existUser = { ...foundUser };

  const key = v4();
  keys.push({ id: keys.length + 1, key: key, user_id: existUser.id });

  const response: ResponseIsAuthencate = {
    status: "success",
    key: key,
    userId: existUser.id,
    userName: existUser.name,
    message: "authencated",
    userImg: existUser.userImg,
  };
  res.status(200).json(response);
};

export { showLoginPage, checkKey, isAuthencate };
