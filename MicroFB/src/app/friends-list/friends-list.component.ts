import { Component, OnInit } from '@angular/core';
import { Friend } from '../Models/friend';
import { UserDataServiceService } from '../DataServices/user-data-service.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  FriendsList : Array<Friend> = [];

  constructor( private UserDataService : UserDataServiceService,) 
  {
    this.loadFriends();
  }


  loadFriends(){
    const id = localStorage.getItem("UserId");
    this.UserDataService.getUserFriends(id).subscribe(
      (data) => {
        this.FriendsList = data;
        console.log("FriendsList:");
        console.log(this.FriendsList);
      }
    )
  }

  ngOnInit() {
    
    

  }

}
