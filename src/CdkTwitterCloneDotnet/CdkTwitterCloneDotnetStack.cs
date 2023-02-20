using console = System.Console;
using Amazon.CDK;
using Amazon.CDK.AWS.DynamoDB;
using Amazon.CDK.AWS.Lambda;
using Constructs;
using System.Diagnostics;
using System.Collections.Generic;
using AssetOptions = Amazon.CDK.AWS.S3.Assets.AssetOptions;

namespace CdkTwitterCloneDotnet
{
    public class CdkTwitterCloneDotnetStack : Stack
    {
        internal CdkTwitterCloneDotnetStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            // The code that defines your stack goes here
            // Bucket bucket = new Bucket(this, "MyFirstBucket");
            var branchName = scope.Node.TryGetContext("branch") ?? "CdkDotNet";
            var tweetTableName = $"{branchName}_tweetTable";
            var userTableName = $"{branchName}_userTable";
            Table tweetsTable = new Table(this, tweetTableName, new TableProps
            {
                TableName = tweetTableName,
                PartitionKey = new Attribute
                {
                    Name = "UserId",
                    Type = AttributeType.STRING
                },
                SortKey = new Attribute
                {
                    Name = "TweetId",
                    Type = AttributeType.STRING
                },
                RemovalPolicy = RemovalPolicy.DESTROY
            });

            Table userProfilesTable = new Table(this, userTableName, new TableProps
            {
                TableName = userTableName,
                PartitionKey = new Attribute
                {
                    Name = "UserId",
                    Type = AttributeType.STRING
                },
                RemovalPolicy = RemovalPolicy.DESTROY
            });

            IEnumerable<string> commands = new[]
            {
                "dotnet tool install -g Amazon.Lambda.Tools",
                "dotnet build",
                "dotnet lambda package -o /asset-output/output.zip"
            };

            var assetOptions = new AssetOptions
            {
                Bundling = new BundlingOptions
                {
                    User = "root",
                    Image = Runtime.DOTNET_6.BundlingImage,
                    Command = new[]
                    {
                        "bash", "-c", string.Join(" && ", commands)
                    }
                }
            };

            var lambdaFunction = new Function(this, "lambdaMinimalAPI", new FunctionProps
            {
                Runtime = Runtime.DOTNET_6,
                Code = Code.FromAsset("./src/lambdaMinimalApi", assetOptions),
                Handler = "lambdaMinimalAPI",
                Environment = new Dictionary<string, string>
                {
                    ["userProfilesTable"] = userProfilesTable.TableName,
                    ["tweetsTable"] = tweetsTable.TableName,
                },
                MemorySize = 256,
                Timeout = Duration.Seconds(30),
                Architecture = Architecture.X86_64
            });

            var lambdaFunctionURL = lambdaFunction.AddFunctionUrl(new FunctionUrlProps
            {
                AuthType = FunctionUrlAuthType.NONE
            });

            userProfilesTable.GrantFullAccess(lambdaFunction);

            tweetsTable.GrantFullAccess(lambdaFunction);

            new CfnOutput(this, "FunctionOutput", new CfnOutputProps
            {
                // The .url attributes will return the unique Function URL
                Value = lambdaFunctionURL.Url
            });
        }
    }
}
