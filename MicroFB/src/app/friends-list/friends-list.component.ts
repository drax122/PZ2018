import { Component, OnInit } from '@angular/core';
import { Friend } from '../Models/friend';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import { SocketService } from '../DataServices/socket.service';
import { Router } from '@angular/router';
import { FriendsListService } from '../DataServices/friends-list.service';
import { Invitation } from '../Models/Invitation';

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
  { // CTOR ACTION

  }

  onShowProfile(User:Friend){
    this.router.navigate(['/profile', User.Id]);
  }

  navigateTo(ConversationId: number){
    this.router.navigate(['/messages', ConversationId]);
  }

  loadFriend(FriendId){
    this.UserDataService.getFriend(FriendId).subscribe(
      (data) => {
        this.FriendsListService.addFriend(data);
      }
    )
  }

  follow(Friend:Friend){
    const id = localStorage.getItem("UserId");
    this.FriendsListService.followFriend(Friend, id);
  }
  unfollow(Friend: Friend){
    const id = localStorage.getItem("UserId");
    this.FriendsListService.unfollowFriend(Friend, id);
  }

  trackStatusByUserIdAndStatus(index:number, friend:Friend): number{
    return friend.Id;
  }



  ngOnInit() {
    const id = localStorage.getItem("UserId");
    // PRZY ODSWIEZENIU/ZALOGOWANIU INICJUJ LISTE ZNAJOMYCH
    this.FriendsListService.loadFriendsList(id);
    // NASLUCHUJ ZMIAN W FRIENDLISCIE
    this.FriendsListService.FriendList.subscribe(fl =>{
      this.FriendsList = fl;
    });
    // NASLUCHUJ NOWEGO ZIOMA
    this.SocketService.Invitations.subscribe((x:Invitation)=>{ // Odebrałem info, że ktoś zaakceptował moje zaproszenie
      this.UserDataService.getFriend(x.TargetPersonId).subscribe((fr:Friend) =>{
        this.FriendsListService.addFriend(fr);
      });
   });
  }
}
