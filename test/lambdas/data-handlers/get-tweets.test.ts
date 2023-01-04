import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { GetItemInput, ScanInput, ScanOutput } from 'aws-sdk/clients/dynamodb';
import {getTweets} from '../../../lib/lambdas/data-handlers/get-tweets';

describe('get-tweets', () => {

  test('Is Function', async () => {
    expect(typeof getTweets).toBe('function')
  })

  test('Performs scan when passed no userId', async () => {

    const returnData = {
      Items: [
        { UserId: 'testId', TweetId: 1, Tweet: "tweet"}
      ]
    }

    AWSMock.setSDKInstance(AWS);
      AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: ScanInput, callback: Function) => {
        console.log('DynamoDB.DocumentClient', 'scan', 'mock called', params);
        callback(null, returnData);
      });

      const client = new AWS.DynamoDB.DocumentClient();

      const result = await getTweets('/tweets', 'tableName', client)

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toHaveProperty('Items');
  })
})