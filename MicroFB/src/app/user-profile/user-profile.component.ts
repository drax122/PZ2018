import { PostsService } from './../DataServices/posts.service';
import { Component, OnInit } from '@angular/core';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import {ActivatedRoute} from '@angular/router';
import { UserDetails } from '../Models/user-details';
import { FriendsListService } from '../DataServices/friends-list.service';
import { Post } from '../Models/post';
import { Invitation } from '../Models/Invitation';
import { SocketService } from '../DataServices/socket.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  UserDetails: UserDetails = new UserDetails({});
  _IsFriend: boolean; // JESLI TRUE - WYSWIETL SZCZEGOLY I JEGO TABLICE // JESLI FALSE WYSWIETL OKROJONE DANE I GUZIK ZAPROS DO ZNAJOMYCH
  BoardData: Array<Post> = []; // Tutaj przechowywane są posty z mojej lub aktualnie przeglądanego użytkownika tablicy!
  postModel = new Post(new Object());
  constructor(private userdataService : UserDataServiceService,
    private route: ActivatedRoute, 
    private friendslistService: FriendsListService,
    private socketService : SocketService,
    private postsService: PostsService)
  {
    this.friendslistService.FriendList.subscribe(x=>{
      console.log(x.length);
      var control = x.filter(obj => {return obj.Id == this.getUserId});
      if(control.length === 1){
        this._IsFriend = true;
      }
      else{
        this._IsFriend = false;
      }
    });


   // LOAD POSTS
   this.postsService.getFriendBoard(this.getUserId).subscribe(data=>{
    this.BoardData = data;
    console.log("BOARD LOADED:");
    console.dir(this.BoardData);
  });
  }
  get IsFriend(){
    return this._IsFriend;
  }

  get getUserId(){
     return parseInt(this.route.snapshot.paramMap.get('id'));
  }
  get CurrentUserId(){
    return parseInt(localStorage.getItem("UserId"));
  }
  invite()
  {
    this.userdataService.inviteUser(this.CurrentUserId, this.getUserId).subscribe((x:Invitation)=>{
      this.socketService.SendInv(x);
    });
  }
  ngOnInit() {
   
    this.userdataService.getUserData(this.getUserId).subscribe(data=>{
      console.dir(data);
      this.UserDetails = data;
    })
  }
}
