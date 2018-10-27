using MicroFacebookAPI.DataManager;
using MicroFacebookAPI.DataModel;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Infrastructure;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace MicroFacebookAPI.Providers
{
    public class TokenRefreshProvider : AuthenticationTokenProvider
    {
        public override async Task CreateAsync(AuthenticationTokenCreateContext context)
        {
            var clientid = context.Ticket.Properties.Dictionary["as:client_id"];
            if (string.IsNullOrEmpty(clientid))
            {
                return;
            }

            var refreshTokenId = Guid.NewGuid().ToString("n");

            using (DataManagerService _repo = new DataManagerService())
            {
                var client = _repo.FindClient(clientid);
                var refreshTokenLifeTime = context.OwinContext.Get<string>("as:clientRefreshTokenLifeTime");

                var token = new Client_RefreshTokens()
                {                    
                    RefreshToken = refreshTokenId,
                    ClientId = client.Id,
                    UserName = context.Ticket.Identity.Name,
                    IssuedUtc = DateTime.UtcNow,
                    ExpiresUtc = DateTime.UtcNow.AddMinutes(Convert.ToDouble(refreshTokenLifeTime))
                };
                context.Ticket.Properties.IssuedUtc = token.IssuedUtc;
                context.Ticket.Properties.ExpiresUtc = token.ExpiresUtc;
                token.ProtectedTicket = context.SerializeTicket();
                var result = await _repo.AddRefreshToken(token);
                if (result)
                {
                    context.SetToken(refreshTokenId);
                }
            }
        }

        public override async Task ReceiveAsync(AuthenticationTokenReceiveContext context)
        {
            var allowedOrigin = context.OwinContext.Get<string>("as:clientAllowedOrigin");
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { allowedOrigin });

            string hashedTokenId = context.Token;

            using (DataManagerService _repo = new DataManagerService())
            {
                var refreshToken = _repo.FindRefreshToken(hashedTokenId);
                if (refreshToken != null)
                {
                    //Get protectedTicket from refreshToken class
                    context.DeserializeTicket(refreshToken.ProtectedTicket);
                    var result = await _repo.RemoveRefreshToken(hashedTokenId);
                }
                else
                {
                    context.Response.StatusCode = 401;
                    context.Response.ReasonPhrase = "Invalid or expired refresh token has been provided.";
                }
            }
        }
    }
}