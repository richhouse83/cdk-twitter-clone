import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamoDb from 'aws-cdk-lib/aws-dynamodb';

interface CdkTwitterCloneStackProps extends cdk.StackProps {
   branch: String;
}

export class CdkTwitterCloneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CdkTwitterCloneStackProps) {
    super(scope, id, props);

    const { branch } = props;

    const userProfilesTable = new dynamoDb.Table(this, `${branch}-userTable`, {
      tableName: `${branch}-userTable`,
      billingMode: dynamoDb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'UserId',
        type: dynamoDb.AttributeType.STRING,
      },
    });

    const tweetsTable = new dynamoDb.Table(this, `${branch}-tweetTable`, {
      tableName: `${branch}-tweetTable`,
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

    const apiLambda = new NodejsFunction(this, `${branch}-ApiLambda`, {
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

    const api = new apigateway.LambdaRestApi(this, `${branch}-RestApi`, {
      handler: apiLambda,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_METHODS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    })

  }
}
