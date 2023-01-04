import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

interface CreateUserBody {
  userId: String;
}

export const createUser = async (body: string, tableName: string, docClient: DynamoDB.DocumentClient): Promise<APIGatewayProxyResult> => {
  const parsedBody: CreateUserBody = body ? JSON.parse(body) : null;

    if (!parsedBody?.userId) return {statusCode: 400, body: JSON.stringify({error: "No userId included in request"})};

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: tableName,
      Item: {
        UserId: parsedBody.userId,
        CreatedDate: Date.now()
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