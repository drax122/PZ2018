import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DataProviderService } from '../data-provider.service';
import { UserDetails } from '../Models/user-details';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import { NotificationsServiceService } from '../DataServices/notifications-service.service';
import { UserSearch } from '../Models/user-search';
import { SocketService } from '../DataServices/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  UserData = new UserDetails(new Object());
  SearchPhrase = "";
  SearchResults : UserSearch[];
  Notifications = {};
  FriendsList = {};

  constructor(private auth:AuthService, private router: Router,
     private DataSource : DataProviderService, 
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

  search(){
    this.UserDataService.searchUsers(this.SearchPhrase).subscribe(data=>{
      this.SearchResults = data;      
    });
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
      this.UserDataService.getUserFriends(id).subscribe(
        (data) => {
          this.FriendsList = data;
          localStorage.setItem("FriendsList", JSON.stringify(this.FriendsList));
        }
      )
    }
    else{
      this.UserData = JSON.parse(localStorage.getItem("UserData"));
      this.FriendsList = JSON.parse(localStorage.getItem("FriendsList"));
    }

    // Zawsze pobieraj nowe powiadomienia przy odświeżaniu strony
    this.NotificationsService.getUserNotifications(id).subscribe(
      (data) => {
        this.Notifications = data;
      }
    )
  }
  
  ngOnInit()
  {
    this.SocketService.Imonline(localStorage.getItem("UserId"));
  }
}
