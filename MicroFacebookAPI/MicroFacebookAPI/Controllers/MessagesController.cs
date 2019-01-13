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
        public IHttpActionResult AddMessage([FromBody]ConversationMessages m)
        {
            try
            {
                m.Date = DateTime.Now;
                db.ConversationMessages.Add(m);
                db.SaveChanges();

                db.ConversationMessagesView.Where(x => x.Id == m.Id).FirstOrDefault();
                return Json(m);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        #endregion

    }
}
