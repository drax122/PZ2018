﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class MicroFBEntities : DbContext
    {
        public MicroFBEntities()
            : base("name=MicroFBEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<Friends> Friends { get; set; }
        public virtual DbSet<Client_RefreshTokens> Client_RefreshTokens { get; set; }
        public virtual DbSet<RestfullAPI_Clients> RestfullAPI_Clients { get; set; }
        public virtual DbSet<FriendsView> FriendsView { get; set; }
        public virtual DbSet<ConversationMessages> ConversationMessages { get; set; }
        public virtual DbSet<FriendInvitations> FriendInvitations { get; set; }
        public virtual DbSet<GroupPosts> GroupPosts { get; set; }
        public virtual DbSet<Groups> Groups { get; set; }
        public virtual DbSet<GroupUsers> GroupUsers { get; set; }
        public virtual DbSet<Notifications> Notifications { get; set; }
        public virtual DbSet<UserConversations> UserConversations { get; set; }
        public virtual DbSet<UserFollows> UserFollows { get; set; }
        public virtual DbSet<PostsView> PostsView { get; set; }
        public virtual DbSet<ConversationMessagesView> ConversationMessagesView { get; set; }
        public virtual DbSet<FriendInvitationsView> FriendInvitationsView { get; set; }
        public virtual DbSet<UsersView> UsersView { get; set; }
        public virtual DbSet<UserPosts> UserPosts { get; set; }
        public virtual DbSet<LikesView> LikesView { get; set; }
        public virtual DbSet<PostsLikes> PostsLikes { get; set; }
        public virtual DbSet<NotificationsView> NotificationsView { get; set; }
    }
}
