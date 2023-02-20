
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using System.Text.Json;

namespace lambdaMinimalApi.Queries.GetUser
{
    public class GetUserQueryHandler : IGetUserQueryHandler
    {

        public IAmazonDynamoDB _dBContext { get; }
        public GetUserQueryHandler(IAmazonDynamoDB dBContext)
        {
            _dBContext = dBContext;

        }

        public async Task<string> Handle(GetUserQuery query)
        {
            string userProfilesTable = Environment.GetEnvironmentVariable("userProfilesTable");

            var q = new QueryRequest()
            {
                TableName = userProfilesTable,
                KeyConditionExpression = "UserId = :uid",
                ExpressionAttributeValues =
            {
                [":uid"]= new AttributeValue{S=query.UserId}
            }
            };

            var response = await this._dBContext.QueryAsync(q);

            return JsonSerializer.Serialize( response.Items.First());
        }
    }
}