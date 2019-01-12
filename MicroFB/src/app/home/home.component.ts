import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserDetails } from '../Models/user-details';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import { NotificationsServiceService } from '../DataServices/notifications-service.service';
import { SocketService } from '../DataServices/socket.service';
import { Invitation } from '../Models/Invitation';
import { FriendsListComponent } from '../friends-list/friends-list.component';
import { PostsComponent } from '../posts/posts.component';

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
  @ViewChild('board') postsComp:PostsComponent;

  constructor(
     private auth:AuthService, private router: Router,
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
    this.SocketService.Logout(parseInt(localStorage.getItem("UserId")));
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

  acceptInvitation(InvitationId, accept){ // accept - "True" or "False" jako string lub obiekt js
    // Znajdź zaproszenie po Id
    var Inv = this.Invitations.filter(obj=> {
      return obj.Id === InvitationId;
    })
    // Wyślij info do serwera, zapisz do bazy - przy zwrotce poinformuj socket server, że drugi typ, o ile jest online musi dodać do listy nowego ziomka :x
    this.UserDataService.acceptInvitation(Inv, accept).subscribe(()=>{
      if(accept === true){
        this.friendListComp.loadFriend(Inv.pop().UserId);
        this.SocketService.AcceptInvitation(Inv.pop());
      }
    });
    // Usuń zaproszenie z załadowanej listy zaproszeń
    this.Invitations = this.Invitations.filter(o =>{
      return o.Id != Inv.pop().Id;
    })
  }


  ngOnInit()
  {
     this.SocketService.Imonline(parseInt(localStorage.getItem("UserId")));
  }
}
