import express, { Request, Response } from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";

import { generate } from "./utils/generate";
import { getAllFiles } from "./utils/getAllFiles";
import { uploadAllFile } from "./services/s3Services";
import { redisConnection, startTheDeploy } from "./services/queue";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/upload", async (req: Request, res: Response) => {
  try {
    const { repo_url } = req.body;

    if (!repo_url) throw new Error("Add a valid repository url");
    const id = generate();
    const contentDumpFilePath = path.join(__dirname, `output/${id}`);

    await simpleGit().clone(repo_url, contentDumpFilePath);
    const allFiles = getAllFiles(contentDumpFilePath);

    await uploadAllFile(allFiles);
    const redisResponse = await startTheDeploy(id);
    console.log(redisResponse);

    res.json({
      status: 200,
      message: `Upload completed with a id of ${id}`,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.json({
        status: 400,
        message: error.message,
      });
    }
  }
});

app.get("/status", async (req: Request, res: Response) => {
  const { id } = req.query;
  const uploadStatus = await redisConnection.hget("status", id as string);
  res.json({
    uploadStatus,
  });
});

app.listen(3000, () => {
  console.log("server started at 3000");
});
