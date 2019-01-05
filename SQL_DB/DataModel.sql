CREATE TABLE [Security].[RestfullAPI_Clients](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Secret] [varchar](max) NOT NULL,
	[Name] [varchar](200) NULL,
	[ApplicationType] [int] NOT NULL,
	[Active] [bit] NOT NULL,
	[RefreshTokenLifeTime] [int] NOT NULL,
	[AllowedOrigin] [varchar](max) NULL,
	[ClientId] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [Security].[RestfullAPI_Clients] ADD  DEFAULT ((0)) FOR [ApplicationType]
GO

ALTER TABLE [Security].[RestfullAPI_Clients] ADD  DEFAULT ((1)) FOR [Active]
GO

ALTER TABLE [Security].[RestfullAPI_Clients] ADD  DEFAULT ((14400)) FOR [RefreshTokenLifeTime]
GO

CREATE TABLE [Security].[Client_RefreshTokens](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](300) NOT NULL,
	[ClientId] [int] NOT NULL,
	[IssuedUtc] [datetime] NOT NULL,
	[ExpiresUtc] [datetime] NOT NULL,
	[ProtectedTicket] [varchar](max) NOT NULL,
	[RefreshToken] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [Security].[Client_RefreshTokens]  WITH CHECK ADD FOREIGN KEY([ClientId])
REFERENCES [Security].[RestfullAPI_Clients] ([Id])
GO

CREATE TABLE [Security].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](255) NOT NULL,
	[Password] [varchar](max) NOT NULL,
	[FirstName] [varchar](255) NOT NULL,
	[MiddleName] [varchar](255) NULL,
	[LastName] [varchar](255) NOT NULL,
	[DateOfBirth] [date] NULL,
	[Email] [varchar](200) NULL,
	[PhoneNumber] [varchar](200) NULL,
	[City] [varchar](200) NULL,
	[Street] [varchar](200) NULL,
	[BuildingNumber] [int] NULL,
	[Description] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
CREATE TABLE [Users].[Friends](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[FriendId] [int] NOT NULL,
	[IsObserving] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [Users].[Friends] ADD  DEFAULT ((1)) FOR [IsObserving]
GO

ALTER TABLE [Users].[Friends]  WITH CHECK ADD FOREIGN KEY([FriendId])
REFERENCES [Security].[Users] ([Id])
GO

ALTER TABLE [Users].[Friends]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [Security].[Users] ([Id])
GO

create table dbo.Groups(
Id int identity(1,1) primary key,
Name varchar(255) not null,
OwnerId int not null references Security.Users(Id),
Description varchar(3000)
)
go
create table dbo.GroupUsers(
Id int identity(1,1) primary key,
GroupId int not null references dbo.Groups(Id),
UserId int not null references Security.Users(Id)
)
go
create table dbo.GroupPosts(
Id int identity(1,1) primary key,
AuthorId int not null references Security.Users(Id),
GroupId int not null references dbo.Groups(Id),
Content varchar(max) not null
)
go
create table dbo.UserPosts(
Id int identity(1,1) primary key,
AuthorId int not null references Security.Users(Id),
Content varchar(max) not null,
)
go
create table dbo.UserFollows(
Id int identity(1,1) primary key,
UserId int not null references Security.Users(Id),
FollowedUserId int references Security.Users(Id)
)
go
create table dbo.UserConversations(
Id int identity(1,1) primary key,
UserId int not null references Security.Users(Id),
FriendId int not null references Security.Users(Id),
)
go
create table dbo.ConversationMessages(
Id int identity(1,1) primary key,
ConversationId int not null references dbo.UserConversations(Id),
AuthorId int not null references Security.Users(Id),
Message varchar(max) not null
)
go
insert into [Security].[RestfullAPI_Clients]
  values('smile', 'AngularFBApp', 0, 1, 14400, '*', 'Angular')
go

create table dbo.FriendInvitations(
	Id int identity(1,1) primary key,
	UserId int not null references Security.Users(Id),
	TargetPersonId int not null references Security.Users(Id)
)
go
create table dbo.Notifications(
Id int identity(1,1) primary key,
SourcePersonId int not null references Security.Users(Id),
TargetPersonId int not null references Security.Users(Id),
Type int not null,
Description varchar(max) not null
)

create view dbo.FriendsView
  as 
  select
	Me.Id as 'UserId',
	friend.Id as 'FriendId',
	friend.FirstName as 'FirstName',
	friend.LastName as 'LastName'
	from Users.Friends f
	join Security.Users Me on f.UserId = Me.Id
	join Security.Users friend on f.FriendId = friend.Id
go



