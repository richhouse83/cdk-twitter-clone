using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lambdaMinimalApi.Queries
{
  public interface IQueryHandler<TQuery, TResult>
        where TQuery: IQuery
    {
        Task<TResult> Handle(TQuery query);
    }
}