using MicroFacebookAPI.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace MicroFacebookAPI.DataManager
{
    public class DataManagerService : IDisposable
    {
        public RestfullAPI_Clients FindClient(string clientId)
        {
            using (var ctx = new MicroFBEntities())
            {                
                var client = ctx.RestfullAPI_Clients.Where(x=> x.ClientId == clientId).FirstOrDefault();
                return client;
            }
        }

        public async Task<bool> AddRefreshToken(Client_RefreshTokens token)
        {
            using (var ctx = new MicroFBEntities())
            {
                var existingToken = ctx.Client_RefreshTokens.Where(tokens => tokens.UserName == token.UserName && tokens.ClientId == token.ClientId).SingleOrDefault();
                if (existingToken != null)
                {
                    var result = await RemoveRefreshToken(existingToken.RefreshToken);
                }

                ctx.Client_RefreshTokens.Add(token);
                return await ctx.SaveChangesAsync() > 0;
            }
        }

        public async Task<bool> RemoveRefreshToken(string tokenToremoveId)
        {
            using (var ctx = new MicroFBEntities())
            {
                var refreshToken = ctx.Client_RefreshTokens.Where(x => x.RefreshToken == tokenToremoveId).FirstOrDefault();

                if (refreshToken != null)
                {
                    ctx.Client_RefreshTokens.Remove(refreshToken);
                    return await ctx.SaveChangesAsync() > 0;
                }

                return false;
            }
        }

        public async Task<bool> RemoveRefreshToken(Client_RefreshTokens refreshToken)
        {
            using (var ctx = new MicroFBEntities())
            {
                ctx.Client_RefreshTokens.Remove(refreshToken);
                return await ctx.SaveChangesAsync() > 0;
            }
        }

        public Client_RefreshTokens FindRefreshToken(string refreshTokenId)
        {
            using (var ctx = new MicroFBEntities())
            {
                var refreshToken = ctx.Client_RefreshTokens.Where(x=> x.RefreshToken == refreshTokenId).FirstOrDefault();
                return refreshToken;
            }
        }

        public List<Client_RefreshTokens> GetAllRefreshTokens()
        {
            using (var ctx = new MicroFBEntities())
            {
                return ctx.Client_RefreshTokens.ToList();
            }
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}