import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamoDb from 'aws-cdk-lib/aws-dynamodb';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkTwitterCloneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userProfilesTable = new dynamoDb.Table(this, 'userTable', {
      tableName: 'userProfilesTable',
      billingMode: dynamoDb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'UserId',
        type: dynamoDb.AttributeType.STRING,
      },
    });

    const tweetsTable= new dynamoDb.Table(this, 'tweetsTable', {
      tableName: 'tweetMessagesTable',
      billingMode: dynamoDb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'UserId',
        type: dynamoDb.AttributeType.STRING,
      },
      sortKey: {
        name: 'TweetId',
        type: dynamoDb.AttributeType.STRING
      }
    })

    const apiLambda = new NodejsFunction(this, 'apiLambda', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, `/lambdas/apilambda.ts`),
      environment: {
        userProfilesTable: userProfilesTable.tableName,
        tweetsTable: tweetsTable.tableName,
      },
      logRetention: cdk.aws_logs.RetentionDays.ONE_DAY
    });

    userProfilesTable.grantReadWriteData(apiLambda);
    tweetsTable.grantReadWriteData(apiLambda);

    const api = new apigateway.LambdaRestApi(this, 'LambdaRestApi', {
      handler: apiLambda
    })
    
  }
}
