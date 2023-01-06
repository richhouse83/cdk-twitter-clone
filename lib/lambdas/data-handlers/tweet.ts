import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import {v4 as uuid} from 'uuid';


interface CreateTweetBody {
  userId: String;
  tweetMessage: String;
}

export const tweet = async (body: string, userProfilesTable: string, tweetsTable: string, docClient: DynamoDB.DocumentClient): Promise<APIGatewayProxyResult> => {
  const {userId, tweetMessage}: CreateTweetBody = body ? JSON.parse(body) : {};

    if (!userId || !tweetMessage) return {statusCode: 400, body: JSON.stringify({error: "UserId or Message missing in request"})};

    try {
      const checkForUserParams: DynamoDB.DocumentClient.GetItemInput = {
        TableName: userProfilesTable,
        Key: {
          UserId: userId,
        }
      }

      const checkForUserResponse = await docClient.get(checkForUserParams).promise();

      if (!checkForUserResponse?.Item) return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST"
        },
        body: JSON.stringify({message: 'User Not Found'})
      }
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST"
        },
        body: JSON.stringify(error)
      }
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

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST"
        },
        body: JSON.stringify({message: `Tweet for ${userId} successfully added`})
      }    
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST"
        },
        body: JSON.stringify(error)
      }
    }
}