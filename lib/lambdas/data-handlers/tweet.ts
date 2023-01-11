import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuid } from 'uuid';


export interface CreateTweetBody {
  userId: string;
  tweetMessage: string;
}

export const tweet = async (body: string, userProfilesTable: string, tweetsTable: string, docClient: DynamoDB.DocumentClient): Promise<APIGatewayProxyResult> => {
  const { userId, tweetMessage }: CreateTweetBody = body ? JSON.parse(body) : {};

  if (!userId || !tweetMessage) return createReturnObject(400, { error: "UserId or Message missing in request" });

  try {
    const checkForUserParams: DynamoDB.DocumentClient.GetItemInput = {
      TableName: userProfilesTable,
      Key: {
        UserId: userId,
      }
    }

    const checkForUserResponse = await docClient.get(checkForUserParams).promise();

    if (!checkForUserResponse?.Item) return createReturnObject(400)
  } catch (error) {
    return createReturnObject(500, error)
  }

  const tweetParams: DynamoDB.DocumentClient.PutItemInput = {
    TableName: tweetsTable,
    Item: {
      UserId: userId,
      TweetId: uuid(),
      Tweet: tweetMessage,
      CreatedDate: Date.now()
    },
  }

  try {
    await docClient.put(tweetParams).promise();

    return createReturnObject(200, null, userId)
  } catch (error) {
    return createReturnObject(500, error)
  }
}

const createReturnObject = (statusCode: number, error: null | unknown = null, userId: null | string = null): APIGatewayProxyResult => {

  let body: any = error
    ? error
    : userId
    ? { message: `Tweet for ${userId} successfully added` }
    : { message: 'User not found' }

  body = JSON.stringify(body);

  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
    },
    body,
  }
}