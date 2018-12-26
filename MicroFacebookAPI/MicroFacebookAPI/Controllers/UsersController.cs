using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using MicroFacebookAPI.DataManager;
using MicroFacebookAPI.DataModel;

namespace MicroFacebookAPI.Controllers
{
    public class UsersController : ApiController
    {
        private MicroFBEntities db = new MicroFBEntities();
        private DataManagerService ds = new DataManagerService();

        #region GET METHODS        
        [Authorize]
        [ResponseType(typeof(Users))]
        [Route("api/users/getusers")]
        public IHttpActionResult GetUsers(int Id)
        {
            Users users = db.Users.Where(x => x.Id == Id).FirstOrDefault();
            if (users == null)
            {
                return NotFound();
            }
            return Json(users);
        }

        [Authorize]
        [ResponseType(typeof(Users))]
        [Route("api/users/getfriends")]
        public IHttpActionResult GetFriends(int userId)
        {
            var users = db.FriendsView.Where(x => x.UserId == userId).ToList();
            if (users == null)
            {
                return NotFound();
            }
            return Json(users);
        }

        [Authorize]
        [ResponseType(typeof(Users))]
        [Route("api/users/search")]
        public IHttpActionResult Search(string phrase)
        {
            var users = db.Users.Where(x=> 
                x.FirstName.Contains(phrase)
                || x.LastName.Contains(phrase)
                || x.MiddleName.Contains(phrase)
                || x.PhoneNumber.Contains(phrase)).ToList();
            return Json(users);
        }
        #endregion

        #region POST METHODS / SAVING DATA
        [HttpPost]
        [Route("api/users/registeruser")]
        public IHttpActionResult RegisterUser([FromBody]Users user)
        {
            try
            {
                ds.CreateUser(user);
                return Json(user);
            }
            catch(Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        [Authorize]
        [HttpPost]
        [Route("api/users/makefriend")]
        public IHttpActionResult MakeFriend(int userId, int friendId)
        {
            try
            {
                var tmp = new Friends
                {
                    UserId = userId,
                    FriendId = friendId,
                    IsObserving = true,
                };
                var tmp2 = new Friends
                {
                    UserId = friendId,
                    FriendId = userId,
                    IsObserving = true,
                };
                db.Friends.AddRange(new[] { tmp, tmp2 });
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("api/users/unmakefriend")]
        public IHttpActionResult UnmakeFriend(int userId, int friendId)
        {
            try
            {
                var friend = db.Friends.Where(x => (x.UserId == userId && x.FriendId == friendId) || (x.UserId == friendId  && x.FriendId == userId));
                if (friend.Any())
                {                 
                    db.Friends.RemoveRange(friend);
                    db.SaveChanges();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("api/users/unfollowfriend")]
        public IHttpActionResult UnfollowFriend(int userId, int friendId)
        {
            try
            {
                var friend = db.Friends.Where(x => x.UserId == userId && x.FriendId == friendId).FirstOrDefault();
                if (friend != null)
                {
                    friend.IsObserving = false;
                    db.SaveChanges();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("api/users/Followfriend")]
        public IHttpActionResult FollowFriend(int userId, int friendId)
        {
            try
            {
                var friend = db.Friends.Where(x => x.UserId == userId && x.FriendId == friendId).FirstOrDefault();
                if (friend != null)
                {
                    friend.IsObserving = true;
                    db.SaveChanges();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        #endregion
    }
}