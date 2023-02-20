using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lambdaMinimalApi.Queries.GetTweets
{
    public class GetTweetsQuery : IQuery
    {
        public string? UserId { get; set; }
        public GetTweetsQuery(string? userId)
        {
            this.UserId = userId;
            
        }
    }
}