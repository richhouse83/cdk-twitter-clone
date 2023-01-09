import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface CdkTwitterCloneStackProps extends cdk.StackProps {
   branch: String;
}

export class CdkTwitterCloneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CdkTwitterCloneStackProps) {
    super(scope, id, props);

    // Use this variable naming your tables and constructs, in order to
    // stop conflicts with other branches
    const { branch } = props;

    // Suggested solution part 1 - Create 2 DynamoDB tables, for UserProfiles and Tweets



    // Suggested solution part 2 - Use the lambda code located in /lambdas/apilambda.ts 
    // to create a NodejsFunction construct, passing in your tables as environment variables
    // DON'T FORGET TO GRANT PERMISSIONS!

    // Suggested solution part 3 - Pass in your lmabda into a LambdaRestApi proxy gateway 

  }
}
