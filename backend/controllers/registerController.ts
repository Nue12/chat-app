import { Request, Response } from "express";
import { join } from "path";
import { usersModel } from "../models/users";
import { v4 as uuidv4 } from "uuid";
import { writeFileSync } from "fs";
import { validateSignup } from "../models/validator";
const sgMail = require("@sendgrid/mail");
import dotenv from "dotenv";

dotenv.config();

const sendGridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridApiKey);

interface ResponseRegisterUser {
  status: "success" | "fail";
  message: string;
  userEmail?: string;
  redirectUrl?: string;
}

interface RequestRegisterUser {
  name: string;
  email: string;
  password: string;
  active: boolean;
  socketId: string;
}

let verifyId: string;
let verifyIdArr: string[] = [];

const users = usersModel.getUsersData();

let newUser: {
  id: string;
  name: string;
  email: string;
  password: string;
  active: false;
  socketId: "";
  userImg: "";
};

function resForErr(msg: string, res: Response) {
  const response: ResponseRegisterUser = {
    status: "fail",
    message: msg,
  };
  return res.status(200).send(response);
}

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password }: RequestRegisterUser = req.body;

  const { error } = validateSignup({ email, password });

  if (error) {
    resForErr(error.message, res);
    return;
  }

  const hasUser = users.some(
    (user) => user.name === name || user.email === email
  ); // check user exist

  if (hasUser) {
    const errMsg = "username or email  already exist!";
    resForErr(errMsg, res);
    return;
  } else {
    ////////////// send code to user to verify ///////////////////

    verifyId = gnrVerifyId(6);
    verifyIdArr.push(verifyId);
    console.log("verify Id", verifyId);

    const response: ResponseRegisterUser = {
      status: "success",
      message: "email and username can be available",
      userEmail: email,
      redirectUrl: "/verify",
    };

    newUser = {
      id: uuidv4(),
      name: name,
      email: email,
      password: password,
      active: false,
      socketId: "",
      userImg: "",
    };

    const message = {
      to: email,
      from: "nuebusiness382@gmail.com",
      subject: "verify code",
      text: `This is your OTP verify code: ${verifyId}`,
      html: `<strong>This is your OTP verify code: ${verifyId}</strong>`,
    };

    await sgMail.send(message).then(
      () => {
        console.log("sended email");
      },
      (error: any) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
    ////////////////////// after verify //////////////////////////
    // users.push({
    //   id: uuidv4(),
    //   name,
    //   email,
    //   password,
    //   active: false,
    //   socketId: "",
    //   userImg: "",
    // });
    // usersModel.setUsersData(users); // set Users Data
    // const response: ResponseRegisterUser = {
    //   status: "success",
    //   message: "registration successfully!",
    //   redirectUrl: "/login",
    // };
    return res.status(200).send(response);
  }
};

console.log("verifyIdArr", verifyIdArr);
const verifiedEmail = (req: Request, res: Response) => {
  const reqOtpCode = req.body;
  const hasOtpCode = verifyIdArr.find((arr) => arr === reqOtpCode.otpCode);
  console.log(hasOtpCode);

  if (hasOtpCode) {
    users.push(newUser);
    usersModel.setUsersData(users); // set Users Data
    verifyIdArr = verifyIdArr.filter((arr) => arr !== reqOtpCode.otpCode);
    console.log(verifyIdArr);
    const response: ResponseRegisterUser = {
      status: "success",
      message: "registration successfully!",
      redirectUrl: "/login",
    };
    res.status(200).send(response);
  } else {
    const errMsg = "fill the right OTP code";
    resForErr(errMsg, res);
    return;
  }

  res.send({ data: "otp code arrive to backend" });
};

function gnrVerifyId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result.toUpperCase();
}

const showRegister = (req: Request, res: Response) => {
  return res
    .status(200)
    .sendFile(
      join(
        __dirname,
        "..",
        "..",
        "frontend",
        "src",
        "pages",
        "register",
        "register.html"
      )
    );
};

export { registerUser, showRegister, verifiedEmail };
