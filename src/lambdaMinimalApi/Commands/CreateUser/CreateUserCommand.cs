using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lambdaMinimalApi.Commands.CreateUser
{
    public class CreateUserCommand: ICommand
    {
        public string UserId { get; set; }

        public CreateUserCommand(string userId)
        {
            this.UserId = userId;
        }
    }
}