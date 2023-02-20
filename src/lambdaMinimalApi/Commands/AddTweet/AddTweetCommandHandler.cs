using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

namespace lambdaMinimalApi.Commands.AddTweet
{
    public class AddTweetCommandHandler : IAddTweetCommandHandler
    {
        public IAmazonDynamoDB _dBContext { get; }
        public AddTweetCommandHandler(IAmazonDynamoDB dBContext)
        {
            _dBContext = dBContext;

        }
        public async Task<string> Handle(AddTweetCommand command)
        {
            string tweetsTable = Environment.GetEnvironmentVariable("tweetsTable");

            var item = new Dictionary<string, AttributeValue>
            {
                ["UserId"] = new AttributeValue
                {
                    S = command.UserId,
                },
                ["Tweet"] = new AttributeValue
                {
                    S = command.TweetMessage
                },
                ["CreatedDate"] = new AttributeValue
                {
                    S = DateTime.UtcNow.ToShortDateString()
                },
                ["TweetId"] = new AttributeValue
                {
                    S = Guid.NewGuid().ToString()
                }
            };

            var request = new PutItemRequest
            {
                TableName = tweetsTable,
                Item = item,
            };

            var response = await this._dBContext.PutItemAsync(request);
            return JsonSerializer.Serialize(new { message = response });
        }
    }
}