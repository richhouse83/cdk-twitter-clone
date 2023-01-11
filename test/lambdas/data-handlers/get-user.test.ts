import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { getUser } from '../../../lib/lambdas/data-handlers/get-user';

describe('get-user tests', () => {

  test('Returns 200 with user when user exists', async () => {
    const testName = 'Test.Name'
    const returnData = {
      Item: [
        { UserId: testName}
      ]
    }
    
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: null, callback: Function) => {
      callback(null, returnData);
    });

    const client = new AWS.DynamoDB.DocumentClient();


    const result = await getUser('/user/' + testName, 'tableName', client)

    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body)).toHaveProperty('Item');

    AWSMock.restore();
  })

  test('Returns 404 with user when user does not exist', async () => {
    const testName = 'Test.Name'
    const returnData = {
    }
    
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: null, callback: Function) => {
      callback(null, returnData);
    });

    const client = new AWS.DynamoDB.DocumentClient();


    const result = await getUser('/user/' + testName, 'tableName', client)

    expect(result.statusCode).toBe(404)
    expect(JSON.parse(result.body)).not.toHaveProperty('Item');

    AWSMock.restore();
  })

  test('Returns 400 with userId not passed in', async () => {

    const client = new AWS.DynamoDB.DocumentClient();


    const result = await getUser('/user', 'tableName', client)

    expect(result.statusCode).toBe(400)
    expect(JSON.parse(result.body)).not.toHaveProperty('Item');

    AWSMock.restore();
  })

})