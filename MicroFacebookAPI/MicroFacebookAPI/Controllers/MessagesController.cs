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
    public class MessagesController : ApiController
    {
        // TO DO:
        // 1. Pobierz listę wiadmości w mojej konwersacji
        // 2. Wyślij wiadomość do konwersacji
        private MicroFBEntities db = new MicroFBEntities();
        #region GET METHODS        
        [Authorize]
        [ResponseType(typeof(ConversationMessages))]
        [HttpGet]
        [Route("api/messages/getmessages/{ConversationId}")]
        public IHttpActionResult GetMessages(int ConversationId)
        {
            var messages = db.ConversationMessagesView.Where(x => x.ConversationId == ConversationId).OrderByDescending(x => x.Date);
            return Json(messages);
        }
        #endregion
        #region POST - SAVING DATA
        [HttpPost]
        [Route("api/messages/addmessage")]
        public IHttpActionResult SavePost([FromBody]ConversationMessages m)
        {
            try
            {
                m.Date = DateTime.Now;
                db.ConversationMessages.Add(m);

                var conv = db.UserConversations.Where(x => x.Id == m.ConversationId).FirstOrDefault();
                var targetId = conv.FriendId == m.AuthorId ? conv.UserId : conv.FriendId;

                var not = new Notifications
                {
                    Description = "Masz nową wiadomość od",
                    SourcePersonId = m.AuthorId,
                    TargetPersonId = targetId.Value,
                    Type = 2,
                };

                db.Notifications.Add(not);
                db.SaveChanges();
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
