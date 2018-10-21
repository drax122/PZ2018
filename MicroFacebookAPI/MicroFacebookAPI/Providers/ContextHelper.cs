using MicroFacebookAPI.CustomErrorProvider;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MicroFacebookAPI.Providers
{
    public static class ContextHelper
    {
        public static void SetCustomError(this OAuthGrantResourceOwnerCredentialsContext context, string errorMessage)
        {
            var json = new ErrorMessage(errorMessage).ToJsonString();

            context.SetError(json);
            context.Response.Write(json);
        }
        public static string ToJsonString(this object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }
    }
}