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
    public class NotificationsController : ApiController
    {
        // TO DO
        // 1. Dodaj nowe powiadomienie
        // 2. Oznacz jako przeczytane
        private MicroFBEntities db = new MicroFBEntities();
        #region GET METHODS        
        [Authorize]
        [ResponseType(typeof(Notifications))]
        [HttpGet]
        [Route("api/notifications/getusernotifications/{UserId}")]
        public IHttpActionResult GetUserNotifications(int UserId)
        {
            var nots = db.Notifications.Where(x => x.TargetPersonId == UserId);
            return Json(nots);
        }
        #endregion
        #region Save methods
        [Authorize]
        [HttpPost]
        [Route("api/notifications/add")]
        public IHttpActionResult Add([FromBody] Notifications not)
        {
            not.Date = DateTime.Now;
            db.Notifications.Add(not);
            db.SaveChanges();

            var res = db.NotificationsView.Where(x => x.Id == not.Id).FirstOrDefault();
            return Json(res);
        }
        #endregion

    }
}
