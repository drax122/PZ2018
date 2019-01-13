import { Injectable } from '@angular/core';
import { Friend } from '../Models/friend';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserDataServiceService } from './user-data-service.service';
import { debug } from 'util';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsListService {
  local : Array<Friend> = [];
  FriendsStatusList : Array<number> = new Array<number>();

  private friendList = new BehaviorSubject<Array<Friend>>([]);
  FriendList = this.friendList.asObservable();

  constructor(private UserDataService: UserDataServiceService, private SocketService : SocketService) 
  { 
        // Nasłuchiwanie na eventy z socketservera dotyczące tego komponentu
       // data to Id nowego ziomka - muszę go pobrać i dopisać do listy
     this.loadFriendsList(parseInt(localStorage.getItem("UserId")));
     this.SocketService.Status.subscribe(data=> { 
        var ids = new Array<number>();
        data.forEach(element => {
          ids.push(parseInt(element.UserId));
        });
        ids.forEach(element => {
          if(this.FriendsStatusList.indexOf(element) < 0){
            this.FriendsStatusList.push(element);         
          } 
        });
        if(this.local.length >0){
          this.applyStatusToFriendList();
        }
    });
    // odbiera event UserLoggedIn przekazując w data UserId -- jeśli UserId jest w mojej liście znajomych zmień jego status zalogowania
    this.SocketService.Connect.subscribe(data=> {
      if(this.FriendsStatusList.indexOf(data) < 0){
        this.FriendsStatusList.push(data);
      }
      if(this.local.length >0){
          this.applyStatusToFriendList();
      }
    });
    // odbiera event UserLoggedOut ...
    this.SocketService.Disconnect.subscribe(data=>{
      this.FriendsStatusList.splice(this.FriendsStatusList.indexOf(data),1);
      console.log("LOGOUT OF USER : "+ data)
      if(this.local.length >0){
        this.applyStatusToFriendList();
      }
    });
  }

  loadFriendsList(Id){
    this.UserDataService.getUserFriends(Id).subscribe(
      (data) => {
        this.local = data;
        this.applyStatusToFriendList();
        this.friendList.next(this.local);        
      }
    )
  }
  applyStatusToFriendList(){
    if(this.local.length >0){
      var changesCount = 0;
        this.local.forEach(element => {
          var control = this.FriendsStatusList.indexOf(element.Id);
          if(control >= 0){
            if(element.Status !== 1){
              element.Status = 1;
              changesCount++;
            }
          }
          else{
            if(element.Status !== 0){
              element.Status = 0;
              changesCount++;
            }
          }
        });
        if(changesCount > 0){
          this.friendList.next(this.local);
        }
    }
  }

  unfollowFriend(Friend:Friend, id){
    this.UserDataService.changefollowFriend(Friend, id, false).subscribe(()=>{ // PO CALLU DO API - ZMIEN W LOKALNEJ LISCIE
      this.changeFollowStatusInFriendList(Friend.Id, 0);
    });

  }
  followFriend(Friend:Friend, id){
    this.UserDataService.changefollowFriend(Friend, id, true).subscribe(()=>{ // PO CALLU DO API - ZMIEN W LOKALNEJ LISCIE
      this.changeFollowStatusInFriendList(Friend.Id, 1);
    });
  }
  changeFollowStatusInFriendList(FriendId:number, status:number){
    this.local.filter(obj => { return obj.Id === FriendId}).forEach(obj=>{
      if(obj.Status === 0){
        obj.Status = 1;
      }
      else{
        obj.Status = 0;
      }
    });
    this.friendList.next(this.local);
  }

  addFriend(Friend:Friend){
    Friend.Status = 0; // new user status to verify - if logged
    this.local.push(Friend);
    this.applyStatusToFriendList();
    this.friendList.next(this.local);  
  }
}