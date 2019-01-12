export class Friend {
    public Id: number; // UserId of our friend - needed everywhere to contact API
    public ConversationId: number;
    public FirstName: string;
    public LastName: string;
    public Status: number; // 0 - OFFLINE, 1 - ONLINE
    public Observing : boolean;
    constructor(obj : any)
    {
        this.Id = obj.FriendId;
        this.Status = 0;
        this.FirstName = obj.FirstName;
        this.LastName = obj.LastName;
        this.ConversationId = obj.ConversationId;
        this.Observing = obj.Observing;
    }

}
