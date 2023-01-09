import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";


export const getUser = async (path: string, tableName: string, docClient: DynamoDB.DocumentClient): Promise<APIGatewayProxyResult> => {
  const userId = path.replace('/user', '').replace(/\//, '');

    if (!userId) return {statusCode: 400, body: JSON.stringify({error: "No userId included in request"})};

    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: tableName,
      Key: {
        UserId: userId
      }
    }

    try {
      const result = await docClient.get(params).promise()
      return {
        statusCode: result?.Item ? 200 : 404,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(result)
      }    
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(error)
      }
    }
}