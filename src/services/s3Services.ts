import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const projectS3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIAQ3EGTAO5QULWTWV5",
    secretAccessKey: "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",
  },
});

export const uploadFile = async (fileName: string, localPath: string) => {
  try {
    const fileData = fs.readFileSync(localPath);
    await projectS3.send(
      new PutObjectCommand({
        Bucket: "samar-dev-bucket",
        Key: fileName,
        Body: fileData,
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
  //get the local path
};

export const uploadAllFile = async (filePaths: string[]) => {
  const baseName = path.basename(__dirname);

  filePaths.forEach(async (el) => {
    await uploadFile(el.slice(__dirname.length - baseName.length), el);
  });
};
