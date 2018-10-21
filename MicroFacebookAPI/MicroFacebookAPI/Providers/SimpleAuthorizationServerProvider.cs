using MicroFacebookAPI.DataModel;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Cors;

namespace MicroFacebookAPI.Providers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            using (var db = new MicroFBEntities())
            {
                if (db != null)
                {
                    var empl = db.Users.ToList();
                    var users = db.Users.ToList();
                    if (users != null)
                    {
                        var user = users.Where(u => u.Username == context.UserName && u.Password == context.Password).FirstOrDefault();
                        if (user != null)
                        {
                            identity.AddClaim(new Claim("Age", "16"));
                            var props = new AuthenticationProperties(new Dictionary<string, string>
                            {
                                {
                                    "userdisplayname", context.UserName
                                },
                                {
                                     "role", "user"
                                }
                             });
                            var ticket = new AuthenticationTicket(identity, props);
                            context.Validated(ticket);
                        }
                        else
                        { 
                            // This is just a work around to overcome an unknown internal bug. 
                            // In future releases of Owin, you may remove this.
                            context.SetError("Invalid credentials", "Provided username or password is incorrect.");
                            //context.Rejected();
                        }
                    }
                }
                else
                {
                    // This is just a work around to overcome an unknown internal bug. 
                    // In future releases of Owin, you may remove this.
                    context.SetError("Invalid credentials", "Provided username or password is incorrect.");
                    //context.Rejected();
                }
                return;
            }
        }
    }
}