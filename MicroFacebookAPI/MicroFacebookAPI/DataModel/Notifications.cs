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
    
    public partial class Notifications
    {
        public int Id { get; set; }
        public int SourcePersonId { get; set; }
        public int TargetPersonId { get; set; }
        public int Type { get; set; }
        public string Description { get; set; }
        public System.DateTime Date { get; set; }
        public bool Shown { get; set; }
    
        public virtual Users Users { get; set; }
        public virtual Users Users1 { get; set; }
    }
}
