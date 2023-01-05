import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { GetItemInput, QueryInput, ScanInput, ScanOutput } from 'aws-sdk/clients/dynamodb';
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
    
    AWSMock.restore();
  })

  test('If Document Client errors during scan, returns 500 status Code', async () => {
    const client = new AWS.DynamoDB.DocumentClient();

    const result = await getTweets('/tweets', 'tableName', client);

    expect(result.statusCode).toBe(500);
  });

  test('Performs a query when userId is supplied', async () => {

    const returnData = {
      Items: [
        { UserId: 'testId', TweetId: 1, Tweet: "tweet"}
      ]
    }

    let queryParams: QueryInput = {
      TableName: ''
    };
    
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: QueryInput, callback: Function) => {
      queryParams = params;
      callback(null, returnData);
    });

    const client = new AWS.DynamoDB.DocumentClient();

    const testName = 'Test.Name'

    const result = await getTweets('/tweets/' + testName, 'tableName', client)

    expect(queryParams?.ExpressionAttributeValues?.[':uid']).toBe(testName)

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toHaveProperty('Items');

    AWSMock.restore();
  });

  test('If Document Client errors during query, returns 500 status Code', async () => {
    const client = new AWS.DynamoDB.DocumentClient();

    const result = await getTweets('/tweets/testname', 'tableName', client);

    expect(result.statusCode).toBe(500);
  });
})