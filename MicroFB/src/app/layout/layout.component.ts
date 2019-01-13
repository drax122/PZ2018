
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SocketService } from '../DataServices/socket.service';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import { NotificationsServiceService } from '../DataServices/notifications-service.service';
import { UserDetails } from '../Models/user-details';
import { Invitation } from '../Models/Invitation';



@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent  {
  UserData = new UserDetails(new Object());
  Invitations : Array<Invitation> = [];
  Notifications = {};

  constructor(private Auth: AuthService, private router: Router,
    private UserDataService : UserDataServiceService,
    private NotificationsService : NotificationsServiceService,
    private SocketService : SocketService) {
      this.getUserData();

    }

  logout()
  {
    this.SocketService.Logout(parseInt(localStorage.getItem("UserId")));
    this.Auth.logOut();
    this.router.navigate(['/home']);
  }

  getUserData()
  {
    const id = localStorage.getItem("UserId");
    if(localStorage.getItem("UserData") === null){

      this.UserDataService.getUserData(id).subscribe( (data) =>
      {
        this.UserData = data;
        localStorage.setItem("UserData", JSON.stringify(this.UserData));
      });

    }
    else
    {
      this.UserData = JSON.parse(localStorage.getItem("UserData"));
    }

    // Zawsze pobieraj nowe powiadomienia przy odświeżaniu strony
    this.NotificationsService.getUserNotifications(id).subscribe(
      (data) => {
        this.Notifications = data;
      }
    )
    // Zawsze zaproszenia do znajomych przy odświeżaniu strony
    this.UserDataService.getUserFriendInvitations(id).subscribe(
      (data) => {
        this.Invitations = data;
        console.log("Pending invs");
        console.log(this.Invitations);
      }
    )
  }
  ngOnInit() {
    this.getUserData();

  }
  get LoggedIn(){
    return this.Auth.IsLogged;
  }

}
