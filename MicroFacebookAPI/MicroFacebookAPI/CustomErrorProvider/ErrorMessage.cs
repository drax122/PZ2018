using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MicroFacebookAPI.CustomErrorProvider
{
    public class ErrorMessage
    {
        public ErrorMessage(string message)
        {
            Message = message;
        }

        public string Message { get; private set; }
    }
}