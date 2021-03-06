export class Invitation {

    public Id: number;
    public TargetPersonId: string;
    public UserId: number;
    public FirstName: string;
    public LastName: string;
    public Status: number; // 0 - pending, 1 - accepted, 2 - rejected
    
    constructor(obj : any)
    {
        this.Id = obj.Id;
        this.TargetPersonId = obj.TargetPersonId;
        this.UserId = obj.UserId;
        this.Status = obj.Status;
        this.FirstName = obj.FirstName;
        this.LastName = obj.LastName
    }
}
