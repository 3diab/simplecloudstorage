// eslint-disable-next-line
const { S3Client, ListObjectsV2Command , PutObjectCommand} = require("@aws-sdk/client-s3");
exports.handler = async function (event) {
  console.log("Received S3 event:", JSON.stringify(event, null, 2));
  // Get the object from the event and show its content type
  const Bucket = event.Records[0].s3.bucket.name; //eslint-disable-line
  const key = event.Records[0].s3.object.key; //eslint-disable-line
  const pathArray = key.split("/");
  const parentFolderArray = pathArray.pop();

  const parentFolder = parentFolderArray.join("/");

  const client = new S3Client({ region: "eu-north-1" });
  const listObjectsInput = {
    Bucket,
    Delimiter: "/",
    Prefix: parentFolder,
  };
  const listObjectsCommand = new ListObjectsV2Command(listObjectsInput);
  try {
    const listObjectsResponse = await client.send(listObjectsCommand);
    console.log(listObjectsResponse);
  } catch (error) {
    console.log("error", error.message);
  }
};
