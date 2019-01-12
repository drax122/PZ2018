export class Post {
    public Id: number; // PostId
    public AuthorId: number; // UserId
    public TargetUserId : number // UserId osoby, na której tablicy został wpisany test post. // domyślnie null -> uzupełniać w przypadku pisania postów na tablicy znajomego
    public AuthorFirstName: string;
    public AuthorLastName: string;
    public TargetUserFirstName: string;
    public TargetUserLastName: string;
    public PostDate: string;
    public PrimaryPostAuthorFirstName: string;
    public PrimaryPostAuthorLastName: string;
    public PrimaryPostDate: string;


    public Content: string; 

    constructor(obj : any)
    {
        this.Id = obj.Id;
        this.AuthorFirstName = obj.AuthorFirstName;
        this.AuthorLastName = obj.AuthorLastName;
        this.AuthorId = obj.AuthorId;
        this.TargetUserId = obj.TargetUserId;
        this.Content = obj.Content;
        this.TargetUserFirstName = obj.TargetUserFirstName;
        this.TargetUserLastName = obj.TargetUserLastName;
        this.PrimaryPostAuthorFirstName = obj.PrimaryPostAuthorFirstName;
        this.PrimaryPostAuthorLastName = obj.PrimaryPostAuthorLastName;
        this.PrimaryPostDate = obj.PrimaryPostDate;
        this.PostDate = obj.PostDate;
    }
}
