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
    
    public partial class RestfullAPI_Clients
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public RestfullAPI_Clients()
        {
            this.Client_RefreshTokens = new HashSet<Client_RefreshTokens>();
        }
    
        public int Id { get; set; }
        public string Secret { get; set; }
        public string Name { get; set; }
        public int ApplicationType { get; set; }
        public bool Active { get; set; }
        public int RefreshTokenLifeTime { get; set; }
        public string AllowedOrigin { get; set; }
        public string ClientId { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Client_RefreshTokens> Client_RefreshTokens { get; set; }
    }
}
