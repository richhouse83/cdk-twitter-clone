using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lambdaMinimalApi.Queries.GetUser
{
    public class GetUserQuery : IQuery
    {
        public string UserId {get;set;}

        public GetUserQuery(string userId)
        {
            this.UserId = userId;
        }
    }
}