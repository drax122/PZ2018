export class UserDetails {

    public Username: string;
    public Email: string;
    //public Password: string;
    public FirstName: string;
    public LastName: string;
    public DateOfBirth: Date;
    public PhoneNumber: string;
    public City: string;
    public Street: string;
    public BuildingNumber: string;
    public Description: string;

    constructor(obj : any)
    {
        this.Username = obj.Username;
        this.Email = obj.Email;
        //this.Password = obj.Password;
        this.FirstName = obj.FirstName;
        this.LastName = obj.LastName;
        this.DateOfBirth = obj.DateOfBirth;
        this.PhoneNumber = obj.PhoneNumber;
        this.City = obj.City;
        this.Street = obj.Street;
        this.BuildingNumber = obj.BuildingNumber;
        this.Description = obj.Description;
    }
}
