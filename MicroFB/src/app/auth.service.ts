import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { UserDetails } from './Models/user-details';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');

  constructor(private http: HttpClient) { }

  setLoggedIn(value: boolean){
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true');
  }
  get isLoggedIn(){
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus);
  }
  logOut(){
    this.setLoggedIn(false);
    localStorage.clear();
    
  }

  Register(user : UserDetails, callback){
    this.http.post('/api/users/RegisterUser', 
    JSON.stringify(user),
    {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    ).subscribe(data => {
        let obj = JSON.parse(JSON.stringify(data));
        console.log(obj);
        callback(obj.UserDisplayName);
      },
      error =>
      {        
        callback(error.error);
      }
    )
  }

  loginUser(email, password, callback){
    console.log(email);
    console.log(password);
    const body = new HttpParams()
    .set('username', email)
    .set('password', password)
    .set('grant_type', "password")
    .set('client_id', "Angular")
    .set('client_secret', "smile")


    this.http.post('/api/authenticate', 
    body.toString(),
    {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    
    }).subscribe(data => {
      let obj = JSON.parse(JSON.stringify(data));
      console.dir(obj);
      this.setLoggedIn(true);
      localStorage.setItem('UserId', (JSON.parse(obj.User)).Id);
      localStorage.setItem('token', obj.access_token);
      localStorage.setItem('refreshtoken', obj.refresh_token);
      
      callback(obj.UserDisplayName);
      
      },
      error =>
      {        
        callback(error.error);
      }
    )
  }
}