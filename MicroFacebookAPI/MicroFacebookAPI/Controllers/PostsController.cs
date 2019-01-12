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
        // 4. Polub/odlub post
        // 5. Usuń post

        #region GET METHODS    
        [Authorize]
        [ResponseType(typeof(UserPosts))]
        [HttpGet]
        [Route("api/posts/getpost/{postId}")]
        public IHttpActionResult GetPost(int postId)
        {
            // Pobieram posty moje / wpisane na moją tablicę / posty znajomych / posty udostępnione przeze mnie
            var post = db.PostsView.Where(x => x.Id == postId).FirstOrDefault();
            return Json(post);
        }
        
        [Authorize]
        [ResponseType(typeof(UserPosts))]
        [HttpGet]
        [Route("api/posts/getboard/{UserId}")]
        public IHttpActionResult GetBoard(int UserId) 
        {
            // Pobieram posty moje / wpisane na moją tablicę / posty znajomych / posty udostępnione przeze mnie
            var observedFriendsIds = db.Friends.Where(x => x.UserId == UserId && x.IsObserving).Select(z => z.FriendId);
            var board = db.PostsView.Where(x => (x.AuthorId == UserId || observedFriendsIds.Contains(x.AuthorId)) || x.TargetUserId == UserId).ToList();

            board = board.OrderByDescending(x => x.PostDate).ToList();

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
        [Authorize]
        [HttpPost]
        [Route("api/posts/savepost")]
        public IHttpActionResult SavePost([FromBody]UserPosts p)
        {
            try
            {
                p.PostDate = DateTime.Now;
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
                return Json(p.Id);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("api/posts/sharepost")]
        public IHttpActionResult SharePost(int UserId,int PostId)
        {
            try
            {
                var post = db.UserPosts.Where(x => x.Id == PostId).FirstOrDefault();
                var newPost = new UserPosts();
                newPost.AuthorId = UserId;
                newPost.Content = post.Content;
                newPost.PostDate = DateTime.Now;
                newPost.PrimaryPostId = PostId;
                db.UserPosts.Add(newPost);
                db.SaveChanges();

                return Ok(newPost.Id);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        #endregion
    }
}
