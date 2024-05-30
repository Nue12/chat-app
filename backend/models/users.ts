import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  socketId: string;
  userImg: string;
}

const getUsersData = (): UserInfo[] =>
  JSON.parse(
    readFileSync(join(__dirname, "..", "database", "users.json"), {
      encoding: "utf-8",
    })
  ) as UserInfo[];

const setUsersData = (userInfo: UserInfo[]): any => {
  writeFileSync(
    join(__dirname, "..", "database", "users.json"),
    JSON.stringify(userInfo)
  );
};

export const usersModel = {
  getUsersData: getUsersData,
  setUsersData: setUsersData,
};
