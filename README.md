# Serverless Twitter Clone - Back end project

This project is designed to give a basic introduction to building a Serverless back end on AWS, using CDK.

## Setup Steps

1. Head to the [front end app](http://serverless-twitter-clone.s3-website.eu-west-2.amazonaws.com/index.html) and take a look.

2. Clone this repo to your local machine.

3. Ensure you have your AWS credentials set up - see [here](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/setup-credentials.html) for instructions for VSCode.

4. Create a new branch, run `npm i` to install dependencies

## Instructions

The project has been built with the following infrastructure in mind, however there are multiple ways to achieve the same result. In addition the project can be expanded on in different ways, some of which are mentioned at the end of this document. Feel free to experiment.

Use the CDK documentation [here](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html) to design your solution.

## Important! ## 
When naming your DB tables, stacks and constructs with the branh name, which is added in to your context via the cli commands when deploying.

It comes into your stack inside of bin/cdk-twitter-clone.ts, DO NOT EDIT THESE LINES UNLESS YOU KNOW WHAT YOU ARE DOING:

```
if (!branch) {
      throw new Error('Branch is required!');
    }

    const twitterCloneStack = new CdkTwitterCloneStack(this, `${branch}-twitterclone-stack`, {
      branch,
    })

    cdk.Tags.of(twitterCloneStack).add('Branch', branch);
  }
  ```

Use in a similar way to this:

```
const table = new dynamoDb.Table(this, `${branch}-table`, {
      tableName: `${branch}-table`,

      // Rest of spec...

      },
    });
```


### Database Layer - AWS DynamoDB

Create 2 Tables:

1. UserProfilesTable - Created with a Partition Key of UserId, and no Sort Key
2. TweetsTable - Also created with a Partition Key of UserId, and a Sort Key of TweetId

Find more info on DynamoDB [here](https://docs.aws.amazon.com/dynamodb/index.html)
CDK spec for DDB is [here](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb-readme.html)

### Compute Layer - AWS Lambda

The code for a single Node.Js Lambda which handles all the logic is included in this repo. The code makes use of [DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) to interact with the DB layer, and expects an APIGateway Proxy event in. Simply create a [NodeJsFunction](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html) construct pointing to the apilambda.ts file, with the handler set as `handler`. Make sure to pass in the DDB table names as Environment Variables, and grant the necessary permissions. Alternatively you can create your own single or multiple lambdas using this [construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html).

## API layer - API Gateway

The simplest solution (with the provided lambda) is to create a [Lambda Rest Api](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.LambdaRestApi.html) with the lambda variable passed in as a handler. This will create an AWS greedy proxy API that passes the request straight through to the lambda for processing.

## API details

Depending on whether you are using the proxy endpoint or a different approach, you will need to define the following paths, either in the Lambda (done for you in the provided code) or defined in API Gateway, to work with the supplied front end.

- `GET /tweets` Returns all tweets in the tweets table. If path includes `/{userId}`, will return only the tweets from that user
- `GET /user` Returns with a 200 if a user exists in the user profile table, otherwise returns a 404
- `POST /create-user` Adds a user to the user table, requires the JSON body:
```
{
  "userId": USERNAME
}
```

- `POST /tweet` Adds a tweet for the supplied userId, which must exist within the user table. Requires the JSON body:

```
{
  "userId": USERNAME,
  "tweetMessage": MESSAGE
}
```


## Deploying to AWS

When you want to deploy your stack to AWS, run the following commands.

`BRANCH=$(git rev-parse --abbrev-ref HEAD)`

This assigns your branch's name to a bash variable.

`cdk deploy --profile [YOUR_AWS_PROFILE] --context branch=$BRANCH`
(replace [YOUR_AWS_PROFILE] with the name of the AWS profile with the correct credentials)

This will run cdk deploy, using your AWS credentials and with the branch name passed into CDK.

The cli will give you a breakdown of any new or uopdated IAM permissions for you to confirm, then attempt to deploy your infrastructure on AWS. If successful you should be then to use the management console to view yoru deployed services.

## To try out your services on the front end.

1. Go to the [API Gateway page of the Management Console](https://eu-west-2.console.aws.amazon.com/apigateway/main/apis?region=eu-west-2) (Check that the region matches where you deployed)
2. Find the name of your Api and navigate to it.
3. Click on `stages`, then `prod`.
4. Copy the 'Invoke URL' address
5. Navigate back to the [front end app](http://serverless-twitter-clone.s3-website.eu-west-2.amazonaws.com/)
6. Paste your api address into the text input at the top of the page and click 'Update Base URL' 
7. The app will ping the API and report back if it has been successful

## Extensions/ Expansions

- Add proper login/ password protection with Cognito, includer Avatars, etc
- Use a Step Function to detect sentiment, remove coarse language
- Split Lambdas for individual tasks
- Allow replies to tweets, images and more
- Subscribe/Follow and timeline customisation

## Other Info

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
