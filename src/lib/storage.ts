import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const initS3 = () => {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_TOKEN,
      secretAccessKey: process.env.R2_SECRET_KEY,
    },
  });
};

export const uploadFile = async (
  file: Express.Multer.File,
  prefix?: string,
): Promise<string> => {
  try {
    const S3 = initS3();
    const rid = randomUUID();
    const filename = file.originalname.split(".");
    const ext = filename[filename.length - 1];

    const key = (prefix ? [prefix, rid].join("/") : rid) + "." + ext;

    const upload = await S3.send(
      new PutObjectCommand({
        Key: key,
        Bucket: "real-estate",
        Body: file.buffer,
      }),
    );
    S3.destroy();
    return key;
  } catch (e) {
    throw e;
  }
};

export const getFile = async (key: string): Promise<string> => {
  try {
    const S3 = initS3();
    const signed = await getSignedUrl(
      S3,
      new GetObjectCommand({ Bucket: "real-estate", Key: key }),
      { expiresIn: 24 * 60 * 60 },
    );
    S3.destroy();
    return signed;
  } catch (e) {
    throw e;
  }
};
