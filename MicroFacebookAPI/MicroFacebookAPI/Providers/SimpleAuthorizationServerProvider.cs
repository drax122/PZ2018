using MicroFacebookAPI.ApplicationTypes;
using MicroFacebookAPI.DataManager;
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
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            string clientId = string.Empty;
            string clientSecret = string.Empty;
            RestfullAPI_Clients client = null;

            if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                context.TryGetFormCredentials(out clientId, out clientSecret);
            }

            if (context.ClientId == null)
            {
                //Remove the comments from the below line context.SetError, and invalidate context 
                //if you want to force sending clientId/secrects once obtain access tokens. 
                context.SetError("Invalid_ClientId", "ClientId should be provided!");
                return Task.FromResult<object>(null);
            }

            using (DataManagerService _repo = new DataManagerService())
            {
                client = _repo.FindClient(context.ClientId);
            }

            if (client == null)
            {
                context.SetError("Invalid_ClientId", string.Format("Client '{0}' is not registered in the system.", context.ClientId));
                return Task.FromResult<object>(null);
            }

            if (client.ApplicationType == (int)AppTypes.AngularApp)
            {
                if (string.IsNullOrWhiteSpace(clientSecret))
                {
                    context.SetError("invalid_clientId", "Client secret should be sent.");
                    return Task.FromResult<object>(null);
                }
                else
                {
                    if (client.Secret != clientSecret)
                    {
                        context.SetError("invalid_clientId", "Client secret is invalid.");
                        return Task.FromResult<object>(null);
                    }
                }
            }

            if (!client.Active)
            {
                context.SetError("Error", "Provided ClientId is currently inactive.");
                return Task.FromResult<object>(null);
            }
            context.OwinContext.Set<string>("as:clientAllowedOrigin", client.AllowedOrigin);
            context.OwinContext.Set<string>("as:clientRefreshTokenLifeTime", client.RefreshTokenLifeTime.ToString());
            context.Validated();
            return Task.FromResult<object>(null);
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
                            identity.AddClaim(new Claim(ClaimTypes.Name, user.Username));
                            // ADD CLAIMS HERE
                            identity.AddClaim(new Claim("Name", user.Username));
                            //
                            var props = new AuthenticationProperties(new Dictionary<string, string>
                            {
                                {
                                    "as:client_id", (context.ClientId == null) ? string.Empty : context.ClientId
                                },
                                {
                                    "UserDisplayName", context.UserName
                                },
                                {
                                     "role", "user"
                                },                                
                             });
                            var ticket = new AuthenticationTicket(identity, props);
                            context.Validated(ticket);
                        }
                        else
                        { 
                            context.SetError("Invalid credentials", "Provided username or password is incorrect.");
                        }
                    }
                }
                else
                {
                    context.SetError("Invalid credentials", "Provided username or password is incorrect.");
                }
                return;
            }
        }
        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }
            return Task.FromResult<object>(null);
        }

        public override Task GrantRefreshToken(OAuthGrantRefreshTokenContext context)
        {
            var originalClient = context.Ticket.Properties.Dictionary["as:client_id"];
            var currentClient = context.ClientId;

            if (originalClient != currentClient)
            {
                context.SetError("Invalid_ClientId", "Refresh token is issued to a different ClientId.");
                return Task.FromResult<object>(null);
            }
            var newIdentity = new ClaimsIdentity(context.Ticket.Identity);

            var newTicket = new AuthenticationTicket(newIdentity, context.Ticket.Properties);
            context.Validated(newTicket);
            return Task.FromResult<object>(null);
        }

    }
}