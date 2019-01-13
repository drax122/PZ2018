export class Message {
    public Id: number; // MessageId
    public AuthorId: number; // UserId
    public ConversationId: number; // Id konwersacji, w której ta wiadomość ma się znaleźć/znajduje
    public FirstName: string;
    public LastName: string;
    public Message: string;  // treść
    public Date: string;

    constructor(obj : any)
    {
        this.Id = obj.Id;
        this.ConversationId = obj.ConversationId;
        this.FirstName = obj.FirstName;
        this.LastName = obj.LastName;
        this.AuthorId = obj.AuthorId;
        this.Message = obj.Message;
        this.Date = obj.Date;
    }
}
