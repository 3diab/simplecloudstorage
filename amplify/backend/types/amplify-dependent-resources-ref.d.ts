export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "userPoolGroups": {
            "AdminsGroupRole": "string"
        },
        "simplecloudauth": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string",
            "CreatedSNSRole": "string"
        }
    },
    "function": {
        "S3Trigger430ffe51": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "simplecloudstoragescslayer": {
            "Arn": "string"
        }
    },
    "storage": {
        "SimpleCloudStaging": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}