import { Component, OnInit } from '@angular/core';
import { Friend } from '../Models/friend';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import { SocketService } from '../DataServices/socket.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  FriendsList : Array<Friend> = [];
  FriendsStatusList : Array<any> = [];

  constructor( private UserDataService : UserDataServiceService, private SocketService : SocketService) 
  {
    this.loadFriends();

    // Nasłuchiwanie na eventy z socketservera dotyczące tego komponentu

    // data to Id nowego ziomka - muszę go pobrać i dopisać do listy
    this.SocketService.Invitations.subscribe(data =>{ 
      console.log("Ziomuś zaakceptował zapro : " + data);
    });
    // odbiera event UsersOnline -- przy zalogowaniu serwer socketów emituje nam pełną listę zalogowanych użytkowników - porównać z naszą listą znajomych i jazda
    this.SocketService.Status.subscribe(data=> { 
        this.FriendsStatusList.push(data);
        console.log("Otrzymano listę statusów : ");
        console.dir( this.FriendsStatusList);
    });
    // odbiera event UserLoggedIn przekazując w data UserId -- jeśli UserId jest w mojej liście znajomych zmień jego status zalogowania
    this.SocketService.Connect.subscribe(data=> {
        console.log("Ziomek się zalogował :" + data);
        this.FriendsStatusList.push({"UserId" : data});
    });
    // odbiera event UserLoggedOut ...
    this.SocketService.Disconnect.subscribe(data=>{
      console.log("Ziomek się wylogował: "+ data);
      this.FriendsStatusList = this.FriendsStatusList.filter(obj=> {
        return obj.UserId !== data; 
      });
    });
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
  loadFriend(FriendId){
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
