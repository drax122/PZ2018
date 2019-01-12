using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MicroFacebookAPI.DataModel
{
    public partial class PostsView
    {
        public List<LikesView> Likes {get;set;}
    }
}