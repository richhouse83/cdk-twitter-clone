using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;

namespace lambdaMinimalApi.Commands.CreateUser
{
    public class CreateUserCommandHandler : ICreateUserCommandHandler
    {
        private readonly IAmazonDynamoDB _dBContext;
        public CreateUserCommandHandler(IAmazonDynamoDB dBContext)
        {
            this._dBContext = dBContext;
            
        }
        public async Task<string> Handle(CreateUserCommand command)
        {
            string userProfilesTable = Environment.GetEnvironmentVariable("userProfilesTable");

            var item = new Dictionary<string, AttributeValue>
            {
                ["UserId"] = new AttributeValue
                {
                    S = command.UserId,
                }
            };

            var request = new PutItemRequest
            {
                TableName = userProfilesTable,
                Item = item,
            };

            var response = await this._dBContext.PutItemAsync(request);

            return JsonSerializer.Serialize(new { message = response });
        }
    }
}