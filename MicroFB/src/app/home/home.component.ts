import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DataProviderService } from '../data-provider.service';
import { UserDetails } from '../Models/user-details';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  UserData = new UserDetails(new Object());

  constructor(private auth:AuthService, private router: Router, private DataSource : DataProviderService) 
  { 
      this.getUserData();
  }

  logout(){
    this.auth.logOut();
    this.router.navigate(['/home']);
  }
  getUserData(){
    const id = localStorage.getItem("UserId");
    this.DataSource.getUserData(id).subscribe( (data) => {
      this.loadUserData(data);
    });
  }
  loadUserData(data){
    console.dir("XD");
    if(data){
      this.UserData = new UserDetails(data)
    }
  }
  ngOnInit() {
  }
}
