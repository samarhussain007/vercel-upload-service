import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string) => {
  const allFilesAndFolders = fs.readdirSync(folderPath);
  let result: Array<string> = [];
  allFilesAndFolders.forEach((el) => {
    const relativePath = path.join(folderPath, el);
    if (fs.statSync(relativePath).isDirectory()) {
      result = result.concat(getAllFiles(relativePath));
    } else {
      result.push(relativePath);
    }
  });
  return result;
};
