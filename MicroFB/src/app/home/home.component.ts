import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserDetails } from '../Models/user-details';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import { NotificationsServiceService } from '../DataServices/notifications-service.service';
import { SocketService } from '../DataServices/socket.service';
import { Invitation } from '../Models/Invitation';
import { FriendsListComponent } from '../friends-list/friends-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  UserData = new UserDetails(new Object());
  Invitations : Array<Invitation> = [];
  Notifications = {};
  @ViewChild('friendsList') friendListComp:FriendsListComponent;

  constructor(private auth:AuthService, private router: Router,
     private SocketService : SocketService,
     private UserDataService : UserDataServiceService,
     private NotificationsService : NotificationsServiceService
     ) 
  { 
    this.getUserData();
  }
  get LoggedIn()
  {
    return this.auth.IsLogged;
  }

  logout()
  {
    this.SocketService.Logout(localStorage.getItem("UserId"));
    this.auth.logOut();
    this.router.navigate(['']);
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

  acceptInvitation(Inv : Invitation, accept){ // accept - "True" or "False" jako string lub obiekt js
    this.UserDataService.acceptInvitation(Inv, accept).subscribe(()=>{
      this.friendListComp.loadFriends();
      // TO DO
      // Powiadomić socket server o zaakceptowaniu zaproszenia i wymusić odświeżenie listy znajomych u drugiego typa jeśli jest online
    });
  }

  ngOnInit()
  {
    this.SocketService.Imonline(localStorage.getItem("UserId"));
  }
}
