import { Request, Response } from "express";
import { join } from "path";

const showVerifyPage = (req: Request, res: Response) => {
  const url = join(
    __dirname,
    "..",
    "..",
    "frontend",
    "src",
    "pages",
    "verify",
    "verify.html"
  );
  return res.sendFile(url);
};

export { showVerifyPage };
