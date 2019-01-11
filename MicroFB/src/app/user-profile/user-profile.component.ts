import { Component, OnInit } from '@angular/core';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import {ActivatedRoute} from '@angular/router'
import { UserDetails } from '../Models/user-details';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  UserDetails : UserDetails = new UserDetails({});

  constructor(private userdataService : UserDataServiceService, private route : ActivatedRoute) 
  { 
     
  }

  ngOnInit() {
    var Id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.userdataService.getUserData(Id).subscribe(data=>{
      console.log("LOADED USER DATA:");
      console.dir(data);
      this.UserDetails = data;
    })
  }
}
