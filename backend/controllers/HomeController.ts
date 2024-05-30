import { Request, Response } from "express";
import { join } from "path";

const showHomePage = (req: Request, res: Response) => {
  res.sendFile(
    join(
      __dirname,
      "..",
      "..",
      "frontend",
      "src",
      "pages",
      "home",
      "index.html"
    )
  );
};

export { showHomePage };
