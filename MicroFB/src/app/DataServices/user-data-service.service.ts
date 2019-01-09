import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../Models/user-details';
import { UserSearch } from '../Models/user-search';
import {Invitation } from '../Models/Invitation';
import { Friend } from '../Models/friend';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserDataServiceService {
  constructor(private http: HttpClient) { }

  getUserData(Id){
    return this.http.get<UserDetails>("/api/users/getusers/"+Id);
  }
  getUserBoard(Id){
    return this.http.get("/api/posts/getboard/"+Id);
  }
  getUserFriends(Id) : Observable<Friend[]>{
    return this.http.get<Array<Friend>>("/api/users/getfriends/"+Id);
  }
  getUserFriendInvitations(Id) : Observable<Invitation[]>{
    return this.http.get<Array<Invitation>>("/api/users/getinvitations/"+Id);
  }
  searchUsers(searchphrase) : Observable<UserSearch[]>{
    return this.http.get<Array<UserSearch>>('/api/users/search',
     {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: { phrase : searchphrase }
     }, 
     );
  }

  inviteUser(UserId, targetUserId){
    var inv = new Invitation({});
    inv.Status = 0;
    inv.TargetPersonId = targetUserId;
    inv.UserId = UserId;
    return this.http.post("/api/users/sendinvitation", JSON.stringify(inv));
  }
  acceptInvitation(InvitationId, accept){ // accept ye/no
      return this.http.post("/api/users/makefriend", null, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        params: {
          "InvitationId" : InvitationId,
          "accept" : accept
        }
      });
  }


}
