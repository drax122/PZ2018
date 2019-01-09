using MicroFacebookAPI.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace MicroFacebookAPI.Controllers
{
    public class PostsController : ApiController
    {
        private MicroFBEntities db = new MicroFBEntities();
        // TO DO:
        // 1. Pobierz posty, które znajdują się na mojej tablicy
        // 2. Utwórz nowy post
        // 3. Udostępnij post na swojej tablicy
        // 4. Polub/odlub post
        // 5. Usuń post

        #region GET METHODS        
        [Authorize]
        [ResponseType(typeof(UserPosts))]
        [HttpGet]
        [Route("api/posts/getboard/{UserId}")]
        public IHttpActionResult GetBoard(int UserId)
        {
            var observedFriendsIds = db.Friends.Where(x => x.UserId == UserId && x.IsObserving).Select(z => z.FriendId);

            var board = db.PostsView.Where(x => x.AuthorId == UserId || observedFriendsIds.Contains(x.AuthorId));
            return Json(board);
        }
        [Authorize]
        [ResponseType(typeof(UserPosts))]
        [HttpGet]
        [Route("api/posts/getuserboard/{UserId}")]
        public IHttpActionResult GetUserBoard(int UserId)
        {
            var board = db.PostsView.Where(x => x.AuthorId == UserId);
            return Json(board);
        }
        #endregion
        #region POST - SAVING DATA
        [HttpPost]
        [Route("api/posts/savepost")]
        public IHttpActionResult SavePost([FromBody]UserPosts p)
        {
            try
            {
                if(p.Id != 0) // edit
                {
                    var pdb = db.UserPosts.Where(x => x.Id == p.Id).FirstOrDefault();
                    pdb.Content = p.Content;
                }
                else // new post
                {
                    db.UserPosts.Add(p);
                }
                db.SaveChanges();
                return Json(p);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        #endregion
    }
}
