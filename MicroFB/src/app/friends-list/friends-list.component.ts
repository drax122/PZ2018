import { Component, OnInit } from '@angular/core';
import { Friend } from '../Models/friend';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import { SocketService } from '../DataServices/socket.service';
import { Router } from '@angular/router';
import { FriendsListService } from '../DataServices/friends-list.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  FriendsList : Array<Friend> = [];
  

  constructor( 
    private UserDataService : UserDataServiceService, 
    private FriendsListService : FriendsListService,
    private SocketService : SocketService, 
    private router: Router) 
  {

    this.SocketService.Invitations.subscribe(data =>{ 
      console.log("Ziomuś zaakceptował zapro : " + data);
      this.UserDataService.getFriend(data).subscribe(f=>{
        this.FriendsListService.addFriend(f);
      })
    });
  }

  onShowProfile(User:Friend){
    this.router.navigate(['/profile', User.Id]);
  }

  loadFriend(FriendId){
    const id = localStorage.getItem("UserId");
    this.UserDataService.getFriend(id).subscribe(
      (data) => {
        this.FriendsListService.addFriend(data);
      }
    )
  }

  ngOnInit() {
    const id = localStorage.getItem("UserId");
    this.FriendsListService.loadFriendsList(id);

    this.FriendsListService.FriendList.subscribe(fl =>{
      this.FriendsList = fl;
      console.log("Komponent listy znajomych załadował do pamięci listę znajomych.");
      console.dir(fl);
    });
  }
}
