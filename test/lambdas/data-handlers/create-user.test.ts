import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { createUser } from '../../../lib/lambdas/data-handlers/create-user';
import { GetItemInput, PutItemInput } from 'aws-sdk/clients/dynamodb';

describe('Create-user unit tests', () => {
  test('Is a function', async () => {
    expect(typeof createUser).toBe('function');
  });

  test('Should call document client successfully when provided correct params', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: PutItemInput, callback: Function) => {
      console.log('DynamoDB.DocumentClient', 'put', 'mock called', params);
      callback(null, { pk: 'foo', sk: 'bar' });
    });


    const client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})

    const userId = 'test';

    const result = await createUser(JSON.stringify({ userId }), 'tableName', client);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({message: `userID ${userId} successfully added`}))

    AWSMock.restore('DynamoDB.DocumentClient');
  });
})