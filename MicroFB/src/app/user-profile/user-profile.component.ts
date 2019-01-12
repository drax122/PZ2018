import { PostsService } from './../DataServices/posts.service';
import { Component, OnInit } from '@angular/core';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import {ActivatedRoute} from '@angular/router';
import { UserDetails } from '../Models/user-details';
import { FriendsListService } from '../DataServices/friends-list.service';
import { Post } from '../Models/post';

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
    private route: ActivatedRoute, private friendslistService: FriendsListService,
     private postsService: PostsService)
  {
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
  invite()
  {
    this.userdataService.inviteUser(this.getUserId, 1);
  }
  ngOnInit() {
    const Id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.userdataService.getUserData(Id).subscribe(data=>{
      console.log("LOADED USER DATA:");
      console.dir(data);
      this.UserDetails = data;
    })
    this.friendslistService.FriendList.subscribe(x=>{
      var control = x.filter(obj => {return obj.Id == Id});
      if(control.length === 1){
        this._IsFriend = true;
      }
      else{
        this._IsFriend = false;
      }
    });
  }
}
