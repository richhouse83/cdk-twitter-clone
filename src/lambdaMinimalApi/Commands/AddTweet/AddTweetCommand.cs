using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lambdaMinimalApi.Commands.AddTweet
{
    public class AddTweetCommand : ICommand
    {
        public string UserId { get; set; }

        public AddTweetCommand(string userId, string tweetMessage)
        {
            this.UserId = userId;
            this.TweetMessage = tweetMessage;
        }

        public string TweetMessage { get; set; }

    }
}