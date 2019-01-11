export class Post {
    public Id: number; // PostId
    public AuthorId: number; // UserId
    public TargetUserId : number // UserId osoby, na której tablicy został wpisany test post. // domyślnie null -> uzupełniać w przypadku pisania postów na tablicy znajomego
    public FirstName: string;
    public LastName: string;
    public TargetUserFirstName: string;
    public TargetUserLastName: string;
    public PrimaryPostAuthorFirstName: string;
    public PrimaryPostAuthorLastName: string;
    public PrimaryPostDate: string;


    public Content: string; 

    constructor(obj : any)
    {
        this.Id = obj.Id;
        this.FirstName = obj.FirstName;
        this.LastName = obj.LastName;
        this.AuthorId = obj.AuthorId;
        this.TargetUserId = obj.TargetUserId;
        this.Content = obj.Content;
        this.TargetUserFirstName = obj.TargetUserFirstName;
        this.TargetUserLastName = obj.TargetUserLastName;
        this.PrimaryPostAuthorFirstName = obj.PrimaryPostAuthorFirstName;
        this.PrimaryPostAuthorLastName = obj.PrimaryPostAuthorLastName;
        this.PrimaryPostDate = obj.PrimaryPostDate;
    }
}
