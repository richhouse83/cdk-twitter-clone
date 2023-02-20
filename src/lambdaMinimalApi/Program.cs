using System.Text.Json;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using lambdaMinimalApi.Commands.AddTweet;
using lambdaMinimalApi.Commands.CreateUser;
using lambdaMinimalApi.Queries.GetTweets;
using lambdaMinimalApi.Queries.GetUser;
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DictionaryKeyPolicy = null;
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
}); ;
builder.Services.AddTransient<IGetTweetsQueryHandler, GetTweetsQueryHandler>();
builder.Services.AddTransient<ICreateUserCommandHandler, CreateUserCommandHandler>();
builder.Services.AddTransient<IAddTweetCommandHandler, AddTweetCommandHandler>();
builder.Services.AddTransient<IGetUserQueryHandler, GetUserQueryHandler>();
builder.Services.AddAWSService<IAmazonDynamoDB>();
builder.Services.AddTransient<IDynamoDBContext, DynamoDBContext>();



// Add AWS Lambda support. When application is run in Lambda Kestrel is swapped out as the web server with Amazon.Lambda.AspNetCoreServer. This
// package will act as the webserver translating request and responses between the Lambda event source and ASP.NET Core.
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors();

app.MapControllers();

app.MapGet("/", () => "Welcome to running ASP.NET Core Minimal API on AWS Lambda");

app.Run();