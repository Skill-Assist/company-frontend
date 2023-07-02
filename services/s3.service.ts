import AWS from "aws-sdk";
import axios from "axios";

AWS.config.update({ region: process.env.NEXT_PUBLIC_REGION });

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
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
      response.data = `https://bucket-skill-assist.s3.sa-east-1.amazonaws.com/recruiter/exam-card-image/1.${type}`;
      return response;
    } catch (error: any) {
      return error;
    }
  },
};

export default s3Service;
