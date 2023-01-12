import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { tweet, CreateTweetBody } from '../../../lib/lambdas/data-handlers/tweet';
import { PutItemInput } from 'aws-sdk/clients/dynamodb';


describe('tweet tests', () => {
  const testUser = 'test.name';
  const testMessage = 'This is a test message';

  const data: CreateTweetBody = {
    userId: testUser,
    tweetMessage: testMessage,
  }
  
  test('Succesfully calls get and put if correct data passed and userId exists', async () => {
    AWSMock.setSDKInstance(AWS);

    const returnData = {
      Item: [
        { UserId: testUser }
      ]
    }

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: null, callback: Function) => {
      callback(null, returnData);
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: PutItemInput, callback: Function) => {
      console.log('DynamoDB.DocumentClient', 'put', 'mock called', params);
      callback(null, { pk: 'foo', sk: 'bar' });
    });

    const client = new AWS.DynamoDB.DocumentClient()

    const result = await tweet(JSON.stringify(data), 'userProfilesTable', 'tweetsTable', client);

    expect(result.statusCode).toBe(200);

    expect(JSON.parse(result.body).message).toBe(`Tweet for ${testUser} successfully added`)
  });

  test.each([[null, testMessage], [testUser, null]])(
    'If either userId or tweetMessage are missing, returns 400',
    async (userId, tweetMessage) => {
      const client = new AWS.DynamoDB.DocumentClient();

      const result = await tweet(JSON.stringify({ userId, tweetMessage }), 'userProfilesTable', 'tweetsTable', client);


      expect(result.statusCode).toBe(400);

      expect(JSON.parse(result.body).error).toBe("UserId or Message missing in request");
    }
  );
})