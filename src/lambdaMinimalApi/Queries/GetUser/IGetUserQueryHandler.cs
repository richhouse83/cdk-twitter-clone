using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lambdaMinimalApi.Queries.GetUser
{
    public interface IGetUserQueryHandler: IQueryHandler<GetUserQuery,string>
    {
        
    }
}