//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MicroFacebookAPI.DataModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class ConversationMessages
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int AuthorId { get; set; }
        public string Message { get; set; }
        public System.DateTime Date { get; set; }
    
        public virtual Users Users { get; set; }
        public virtual UserConversations UserConversations { get; set; }
    }
}
