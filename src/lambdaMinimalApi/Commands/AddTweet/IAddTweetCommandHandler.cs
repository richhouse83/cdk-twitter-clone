using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lambdaMinimalApi.Commands.AddTweet
{
    public interface IAddTweetCommandHandler :ICommandHandler<AddTweetCommand,string>
    {
        
    }
}