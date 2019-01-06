import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from '../Models/user-details';
import { UserSearch } from '../Models/user-search';



@Injectable({
  providedIn: 'root'
})
export class UserDataServiceService {
  constructor(private http: HttpClient) { }

  getUserData(Id){
    return this.http.get<UserDetails>("/api/users/getusers/"+Id);
  }

  searchUsers(searchphrase){
    return this.http.get<UserSearch[]>("/api/users/search/"+searchphrase);
  }

  getUserFriends(Id){
    return this.http.get("/api/users/getfriends/"+Id);
  }

  getUserBoard(Id){
    return this.http.get("/api/posts/getboard/"+Id);
  }
}
