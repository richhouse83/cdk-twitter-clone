import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

export const getTweets = async (path: string, tableName: string, docClient: DynamoDB.DocumentClient): Promise<APIGatewayProxyResult> => {
  
  const scanParams: DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName
  }

  try {
    const results: DynamoDB.DocumentClient.ScanOutput = await docClient.scan(scanParams).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
}