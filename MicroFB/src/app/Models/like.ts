export class Like {
    public Id: number;
    public PostId: number;
    public UserId: number;
    public FirstName: string;
    public LastName: string; 
    constructor(obj : any)
    {
        this.Id = obj.Id;
        this.PostId = obj.PostId;
        this.FirstName = obj.FirstName;
        this.LastName = obj.LastName;
        this.UserId = obj.UserId;
    }
}
