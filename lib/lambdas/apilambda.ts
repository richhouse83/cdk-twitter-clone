import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { createUser } from './data-handlers/create-user';
import { tweet } from './data-handlers/tweet';
import { getTweets } from './data-handlers/get-tweets';

const docClient = new DynamoDB.DocumentClient();
const userProfilesTable = process.env.userProfilesTable;
const tweetsTable = process.env.tweetsTable;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const {httpMethod, path, body} = event;


  if (path === "/create-user" && httpMethod === 'POST') {
    const result = await createUser(body ?? "", userProfilesTable ?? "", docClient);
    return result;
  }

  if (path === '/tweet' && httpMethod === 'POST') {
    const result = await tweet(body ?? "", userProfilesTable ?? "", tweetsTable ?? "", docClient)
    return result;
  }

  if (path.startsWith('/tweets') && httpMethod === 'GET') {
    const result = await getTweets(path, tweetsTable ?? "", docClient)
    return result;
  }


  return {
    statusCode: 404,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  },
    body: JSON.stringify({ message: 'Method not supported'})
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
    "proxy": "create-user"
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