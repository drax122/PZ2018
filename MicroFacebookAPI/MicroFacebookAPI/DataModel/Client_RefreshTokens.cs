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
    
    public partial class Client_RefreshTokens
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public int ClientId { get; set; }
        public System.DateTime IssuedUtc { get; set; }
        public System.DateTime ExpiresUtc { get; set; }
        public string ProtectedTicket { get; set; }
        public string RefreshToken { get; set; }
    
        public virtual RestfullAPI_Clients RestfullAPI_Clients { get; set; }
    }
}
