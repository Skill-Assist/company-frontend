import AWS from "aws-sdk";
import axios from "axios";

AWS.config.update({ region: process.env.NEXT_PUBLIC_REGION });
const cred = new AWS.Credentials({
  accessKeyId: <string>process.env.NEXT_PUBLIC_ACCESS_KEY,
  secretAccessKey: <string>process.env.NEXT_PUBLIC_SECRET_KEY
})

const s3 = new AWS.S3({
  credentials: cred,
  signatureVersion: "v4",
});

const s3Service = {
  uploadFile: async (id: String, file: File) => {
    let type = file.type.replace(/(.*)\//g, "");
    if (type.includes("svg")) type = "svg";

    try {
      const fileParams = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
        Key: `recruiter/exam-card-image/${id}.${type}`,
        ContentType: file.type,
      };

      const url = await s3.getSignedUrlPromise("putObject", fileParams);

      const response = await axios.put(url, file, {
        headers: {
          "Content-type": file.type,
        },
      });
      response.data = `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/recruiter/exam-card-image/${id}.${type}`;
      return response;
    } catch (error: any) {
      return error;
    }
  },
};

export default s3Service;
