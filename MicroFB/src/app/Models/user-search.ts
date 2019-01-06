export class UserSearch {
    public Id : number;
    public Username: string;
    public FirstName: string;
    public LastName: string;
    public PhoneNumber: string;

    constructor(obj : any)
    {
        this.Id = obj.Id;
        this.Username = obj.Username;
        this.FirstName = obj.FirstName;
        this.LastName = obj.LastName;
        this.PhoneNumber = obj.PhoneNumber;
    }
}