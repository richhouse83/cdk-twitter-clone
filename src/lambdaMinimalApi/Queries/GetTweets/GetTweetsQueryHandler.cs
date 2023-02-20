using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

namespace lambdaMinimalApi.Queries.GetTweets
{
    public class GetTweetsQueryHandler : IGetTweetsQueryHandler
    {
        public IAmazonDynamoDB _dBContext { get; }
        public GetTweetsQueryHandler(IAmazonDynamoDB dBContext)
        {
            _dBContext = dBContext;

        }
        public async Task<ScanResult> Handle(GetTweetsQuery query)
        {
            string tweetsTable = Environment.GetEnvironmentVariable("tweetsTable");

            var request = new ScanRequest
            {
                TableName = tweetsTable,
                ProjectionExpression = "UserId, Tweet, TweetId, CreatedDate"
            };

            var response = await this._dBContext.ScanAsync(request);

            return new ScanResult {
                Count = response.Count,
                ScannedCount = response.ScannedCount,
                Items = response.Items.Select(i => new Tweets{
                        UserId = i["UserId"].S,
                        Tweet = i["Tweet"].S,
                        CreatedDate = i["CreatedDate"].S,
                        TweetId = i["TweetId"].S
                }).ToList()
            };
        }
    }
}