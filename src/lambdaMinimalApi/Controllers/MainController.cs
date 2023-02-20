using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.Model;
using lambdaMinimalApi.Commands.AddTweet;
using lambdaMinimalApi.Commands.CreateUser;
using lambdaMinimalApi.Queries.GetTweets;
using lambdaMinimalApi.Queries.GetUser;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace lambdaMinimalAPI.Controllers;

public class CreateUserPayload
{
    public string UserId { get; set; }
}

public class TweetsPayload
{
    public string UserId { get; set; }
}

public class TweetPayload
{
    public string UserId { get; set; }
    public string TweetMessage { get; set; }
}

[ApiController]
[Route("")]
public class MainController : ControllerBase
{
    private readonly ILogger<MainController> _logger;
    private readonly IGetTweetsQueryHandler _tweetsQueryHandler;
    private readonly ICreateUserCommandHandler _createUserCommandHandler;
    private readonly IAddTweetCommandHandler _addTweetCommandHandler;
    private readonly IGetUserQueryHandler _getUserQueryHandler;

    public MainController(
        ILogger<MainController> logger,
        IGetTweetsQueryHandler tweetsQueryHandler,
        ICreateUserCommandHandler createUserCommandHandler,
        IAddTweetCommandHandler addTweetCommandHandler,
        IGetUserQueryHandler getUserQueryHandler)
    {
        _logger = logger;
        _tweetsQueryHandler = tweetsQueryHandler;
        _createUserCommandHandler = createUserCommandHandler;
        _addTweetCommandHandler = addTweetCommandHandler;
        _getUserQueryHandler = getUserQueryHandler;
    }

    [HttpPost("create-user")]
    public async Task<string> CreateUser([FromBody] CreateUserPayload payload)
    {
        return await _createUserCommandHandler.Handle(new CreateUserCommand(payload.UserId));
    }


    [HttpPost("tweet")]
    public async Task<string> Tweet([FromBody] TweetPayload payload)
    {
        return await _addTweetCommandHandler.Handle(new AddTweetCommand(payload.UserId, payload.TweetMessage));
    }


    [HttpGet("user/{userId}")]
    public Task<string> UserItem(string userId)
    {
        return _getUserQueryHandler.Handle(new GetUserQuery(userId));
    }

    [HttpGet("tweets/{userId?}")]
    public Task<ScanResult> Tweets(string? userId)
    {
        return this._tweetsQueryHandler.Handle(new GetTweetsQuery(userId));
    }

    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok(new { ping = "twitter-clone-ping" });
    }




}


