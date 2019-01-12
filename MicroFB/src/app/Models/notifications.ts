export class Notifications {
    public Id: number; // UserId of our friend - needed everywhere to contact API
    public SourcePersonId: number;
    public TargetPersonId: number;
    public SourcePersonFirstName: string;
    public SourcePersonLastName: string;
    public Type: number;
    public Description : string;
    public Shown:boolean;
    public Date:string;
    constructor(obj : any)
    {
        this.Id = obj.Id;
        this.SourcePersonId = obj.SourcePersonId;
        this.TargetPersonId = obj.TargetPersonId;
        this.SourcePersonFirstName = obj.SourcePersonFirstName;
        this.SourcePersonLastName = obj.SourcePersonLastName;
        this.Type = obj.Type;
        this.Description = obj.Description;
        this.Shown = obj.Shown;
        this.Date = obj.Date;
    }

}
