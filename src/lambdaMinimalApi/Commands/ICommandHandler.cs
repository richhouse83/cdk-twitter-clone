using lambdaMinimalApi.Queries;
namespace lambdaMinimalApi.Commands {
 public interface ICommandHandler<TCommand, TResult> where TCommand : ICommand
    {
        Task<TResult> Handle(TCommand command);
    }
}