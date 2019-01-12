import { Component, OnInit } from '@angular/core';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import {ActivatedRoute} from '@angular/router'
import { UserDetails } from '../Models/user-details';
import { FriendsListService } from '../DataServices/friends-list.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  UserDetails : UserDetails = new UserDetails({});
  _IsFriend : boolean;

  constructor(private userdataService : UserDataServiceService, private route : ActivatedRoute, private friendslistService : FriendsListService) 
  { 

  }
  get IsFriend(){
    return this._IsFriend;
  }
  ngOnInit() {
    const Id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.userdataService.getUserData(Id).subscribe(data=>{
      console.log("LOADED USER DATA:");
      console.dir(data);
      this.UserDetails = data;
    })
    var control = this.friendslistService.FriendList.subscribe(x=>{
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
