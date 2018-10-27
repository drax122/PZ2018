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





