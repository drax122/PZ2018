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
        [ResponseType(typeof(UsersView))]
        [HttpGet]
        [Route("api/users/getusers/{Id}")]
        public IHttpActionResult GetUsers(int Id)
        {
            var user = db.UsersView.Where(x => x.Id == Id).FirstOrDefault();
            if (user == null)
            {
                return NotFound();
            }
            return Json(user);
        }

        [Authorize]
        [ResponseType(typeof(Users))]
        [HttpGet]
        [Route("api/users/getfriends/{userId}")]
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
        [HttpGet]
        [Route("api/users/search")]
        public IHttpActionResult Search(string phrase)
        {
            var users = db.Users.Where(x=> 
                   x.FirstName.Contains(phrase)
                || x.LastName.Contains(phrase)
                || x.MiddleName.Contains(phrase)
                ).ToList();

            return Json(users);
        }


        [Authorize]
        [ResponseType(typeof(FriendInvitations))]
        [HttpGet]
        [Route("api/users/getinvitations/{Id}")]
        public IHttpActionResult GetInvitations(int Id)
        {
            var invs = db.FriendInvitationsView.Where(x => x.TargetPersonId == Id && x.Status == 0);
            return Json(invs);
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

        [HttpPost]
        [Route("api/users/sendinvitation")]
        public IHttpActionResult SendInvitation([FromBody]FriendInvitations invitation)
        {
            try
            {
                db.FriendInvitations.Add(invitation);
                db.SaveChanges();

                var res = db.FriendInvitationsView.Where(x => x.Id == invitation.Id).FirstOrDefault();
                return Json(res);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [Authorize]
        [HttpPost]
        [Route("api/users/makefriend")]
        public IHttpActionResult MakeFriend(int InvitationId, bool accept)
        {
            try
            {
                var inv = db.FriendInvitations.Where(x => x.Id == InvitationId).FirstOrDefault();
                if(inv.Status == 1 || inv.Status == 2)
                {
                    // Nie akceptujemy 2 razy etc... w przypadku kilku kliknięć.
                    return Ok();
                }
                if (accept)
                {
                    inv.Status = 1;
                    var tmp = new Friends
                    {
                        UserId = inv.UserId,
                        FriendId = inv.TargetPersonId,
                        IsObserving = true,
                    };
                    var tmp2 = new Friends
                    {
                        UserId = inv.TargetPersonId,
                        FriendId = inv.UserId,
                        IsObserving = true,
                    };
                    
                    var conv = new UserConversations
                    {
                        FriendId = tmp.FriendId,
                        UserId = tmp.UserId,                        
                    };
                    // PRZYJACIELE W BAZIE
                    db.Friends.AddRange(new[] { tmp, tmp2 });
                    // ZALÓŻ KONWERSACJĘ JESLI NIGDY NIE ISTNIAŁA
                    var check = db.UserConversations.Where(x => (x.FriendId == conv.FriendId && x.UserId == conv.UserId) || (x.FriendId == conv.UserId && x.UserId == conv.FriendId));
                    if (!check.Any())
                    {
                        db.UserConversations.Add(conv);
                    }
                }
                else // Nie przyjął zaproszenia - usuń zaproszenie + dodaj powiadomienie na użytkownika, który je wysłał
                {
                    inv.Status = 2;
                    var not = new Notifications
                    {
                        SourcePersonId = inv.TargetPersonId,
                        TargetPersonId = inv.UserId,
                        Description = "Odrzucono zaproszenie do grona znajomych.",
                        Type = 1,
                    };
                    db.Notifications.Add(not);
                    db.FriendInvitations.Remove(inv);
                }
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
                    // Nie usuwam konwersacji, bo w razie gdy znów będą przyjacielami - będą mieli historię.
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
        [Route("api/users/changefollowstatus")]
        public IHttpActionResult ChangeFollowStatus(int FriendId, int UserId, bool Follow)
        {
            try
            {
                var friend = db.Friends.Where(x => x.UserId == UserId && x.FriendId == FriendId).FirstOrDefault();
                if (friend != null)
                {
                    friend.IsObserving = Follow;
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