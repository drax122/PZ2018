using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MicroFacebookAPI.DataModel
{
    public partial class PostsView
    {
        public int? SharingPersonId { get; set; }
        public DateTime? ShareDate { get; set; }
        public string SharingUserFirstName { get; set; }
        public string SharingUserLastName { get; set; }
    }
}