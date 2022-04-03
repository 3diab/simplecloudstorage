import { AmplifyS3ResourceTemplate } from "@aws-amplify/cli-extensibility-helper";

export function override(resources: AmplifyS3ResourceTemplate) {
  resources.s3AuthPrivatePolicy.policyName = "MyTestPolicy";
  resources.s3AuthPrivatePolicy.policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "VisualEditor0",
        Effect: "Allow",
        Action: [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:PutObjectAcl",
        ],
        Resource: `${resources.s3Bucket.attrArn}/private/\${cognito-identity.amazonaws.com:sub}/*`,
      },
    ],
  };
}
