export class Message {
    public Id: number; // MessageId
    public AuthorId: number; // UserId
    public ConversationId: number; // Id konwersacji, w której ta wiadomość ma się znaleźć/znajduje
    public FirstName: string;
    public LastName: string;
    public Content: string;  // treść

    constructor(obj : any)
    {
        this.Id = obj.Id;
        this.FirstName = obj.FirstName;
        this.LastName = obj.LastName;
        this.AuthorId = obj.AuthorId;
        this.Content = obj.Content;
    }
}
