using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.Model;

namespace lambdaMinimalApi.Queries.GetTweets
{
    public interface IGetTweetsQueryHandler : IQueryHandler<GetTweetsQuery, ScanResult>
    {
        
    }
}