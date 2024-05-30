import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { existsSync, mkdirSync } from "fs";
import { loginRouter } from "./routes/loginRouter";
import { registerRouter } from "./routes/registerRouter";
import { historyModel } from "./models/history";
import { usersModel } from "./models/users";
import { homeRouter } from "./routes/homeRouter";
import { userSettingRouter } from "./routes/userSettingRouter";
import { verifyRouter } from "./routes/verifyRouter";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

if (!existsSync("./assets")) {
  mkdirSync("assets");
}

app.use(express.static("../frontend/src"));
app.use(express.static("assets"));
app.use((req, res, next) => {
  console.count(
    `url: ${req.url}  |   method: ${
      req.method
    }   |   date: ${new Date().toUTCString()}`
  );
  next();
});

app.get("/", (req: Request, res: Response) => {
  return res.redirect("/chat");
});

app.use(homeRouter);

app.use(loginRouter);

app.use(registerRouter);

app.use(userSettingRouter);

app.use(verifyRouter);

const server = app.listen(PORT, () => {
  console.log("Server is running on PORT ", PORT, "http://localhost:" + PORT);
});

/////////// SOCKECT THINGS /////////////////

/// it just tesing, you can delete it

let status: { socketId: string; name: string }[] = [];

const io = new Server(server);

io.on("connection", (socket: Socket) => {
  // listen for offline users
  // socket.on("offline", (name) => {
  //   const changeUserData = usersModel.getUsersData().map((user) => {
  //     if (user.name === name) {
  //       return { ...user, active: false, socketId: "" };
  //     }
  //     return user;
  //   });

  //   // change database using model
  //   usersModel.setUsersData(changeUserData);

  //   usersStatusArray(io);
  // });

  socket.on("disconnect", () => {
    const changeUserData = usersModel.getUsersData().map((user) => {
      if (user.socketId === socket.id) {
        return { ...user, active: false, socketId: "" };
      }
      return user;
    });

    // change database using model
    usersModel.setUsersData(changeUserData);

    usersStatusArray(io);
  });

  // listen for active users
  socket.on("active", (name) => {
    // change database using model
    const changeUserData = usersModel.getUsersData().map((user) => {
      if (user.name === name) {
        return { ...user, active: true, socketId: socket.id };
      }
      return user;
    });

    usersModel.setUsersData(changeUserData);

    usersStatusArray(io);
    const histData = historyModel.getChatHistory();

    socket.emit("histData", histData);
  });

  // listen for message
  interface IncomeData {
    message: string;
    userName: string;
    userImg: string;
    timestamp: number;
  }

  socket.on("chat", (data: IncomeData) => {
    const user = usersModel.getUsersData().filter((user) => {
      return user.name === data.userName;
    });
    console.log(data);

    const histData = {
      id: user[0].id,
      userName: data.userName,
      userImg: data.userImg,
      message: data.message,
      timestamp: data.timestamp,
    };

    const messages = historyModel.getChatHistory();
    messages.push(histData);
    historyModel.setChatHistory(messages);
    io.sockets.emit("resData", data);
  });

  // listen for typing
  socket.on("typing", (name) => {
    socket.broadcast.emit("typingPs", name);
  });

  interface UsersStatus {
    name: string;
    active: boolean;
    userImg: string;
  }

  // functions

  // functions for users's status update
  function usersStatusArray(socketIo: Server) {
    const usersStatus: UsersStatus[] = usersModel.getUsersData().map((user) => {
      return {
        name: user.name,
        active: user.active,
        userImg: user.userImg,
      };
    });

    socketIo.sockets.emit("usersStatus", usersStatus);
  }
});
