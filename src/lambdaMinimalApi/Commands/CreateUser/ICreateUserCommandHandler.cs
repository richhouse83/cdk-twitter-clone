using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lambdaMinimalApi.Commands.CreateUser
{
    public interface ICreateUserCommandHandler : ICommandHandler<CreateUserCommand,string>
    {
        
    }
}