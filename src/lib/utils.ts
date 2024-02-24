import * as fs from "node:fs";
import { join } from "path";

export const fileUpload = (
  file: Express.Multer.File,
  filename: string,
  folder: string,
): string => {
  try {
    //process file
    // const upload = await upload(file);
    const directory = join(__dirname, "..", "..", "/static/" + folder);
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);

    const splitFileName = file.originalname.split(".");
    const ext = splitFileName[splitFileName.length - 1];

    fs.writeFileSync(`${directory}/${filename}.${ext}`, file.buffer);
    return `${filename}.${ext}`;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const zeroFill = (number: number): string => {
  const s = "0000000" + number;
  return s.substring(s.length - 8);
};

export const cleanupFile = (filename: string) => {
  fs.unlinkSync(filename);
};
