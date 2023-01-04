import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();
const userProfilesTable = process.env.userProfilesTable;

interface CreateUserBody {
  userId: String;
}
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const {httpMethod, path, body} = event;


  if (httpMethod === 'POST' && path === "/create-user") {
    const parsedBody: CreateUserBody = body ? JSON.parse(body) : null;
    if (!parsedBody) return {statusCode: 400, body: JSON.stringify({error: "No userId included in request"})};
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: userProfilesTable || "",
      Item: {
        UserId: parsedBody.userId
      },
      ConditionExpression: 'attribute_not_exists(UserId)'
    }
    try {
      await docClient.put(params).promise()
      return {
        statusCode: 200,
        body: JSON.stringify({message: `userID ${parsedBody.userId} successfully added`})
      }    
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
  }


  return {
    statusCode: 200,
    body: JSON.stringify(event)
  }
}

/*
Example Event:
{
  "resource": "/{proxy+}",
  "path": "/create-user",
  "httpMethod": "POST",
  "headers": null,
  "multiValueHeaders": null,
  "queryStringParameters": null,
  "multiValueQueryStringParameters": null,
  "pathParameters": {
    "proxy": "create-user:"
  },
  "stageVariables": null,
  "requestContext": {
    "resourceId": "aojvd6",
    "resourcePath": "/{proxy+}",
    "httpMethod": "POST",
    "extendedRequestId": "eNtzHGWOrPEF8xg=",
    "requestTime": "04/Jan/2023:11:02:56 +0000",
    "path": "/{proxy+}",
    "accountId": "670984450623",
    "protocol": "HTTP/1.1",
    "stage": "test-invoke-stage",
    "domainPrefix": "testPrefix",
    "requestTimeEpoch": 1672830176611,
    "requestId": "339ee4a0-5a5e-4a93-82a4-735e4bde4910",
    "identity": {
      "cognitoIdentityPoolId": null,
      "cognitoIdentityId": null,
      "apiKey": "test-invoke-api-key",
      "principalOrgId": null,
      "cognitoAuthenticationType": null,
      "userArn": "arn:aws:iam::670984450623:user/rich-console-access",
      "apiKeyId": "test-invoke-api-key-id",
      "userAgent": "aws-internal/3 aws-sdk-java/1.12.358 Linux/5.4.223-137.414.amzn2int.x86_64 OpenJDK_64-Bit_Server_VM/25.352-b10 java/1.8.0_352 vendor/Oracle_Corporation cfg/retry-mode/standard",
      "accountId": "670984450623",
      "caller": "AIDAZYOOKGI7ZRWKYQQH5",
      "sourceIp": "test-invoke-source-ip",
      "accessKey": "ASIAZYOOKGI7RS36EUFZ",
      "cognitoAuthenticationProvider": null,
      "user": "AIDAZYOOKGI7ZRWKYQQH5"
    },
    "domainName": "testPrefix.testDomainName",
    "apiId": "1hc016tobb"
  },
  "body": "{\n    "userId": \"Rich.House\"\n}",
  "isBase64Encoded": false
}
*/