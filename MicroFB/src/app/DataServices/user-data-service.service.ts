import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../Models/user-details';
import { UserSearch } from '../Models/user-search';
import {Invitation } from '../Models/Invitation';
import { Friend } from '../Models/friend';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../Models/user';


@Injectable({
  providedIn: 'root'
})
export class UserDataServiceService {

  constructor(private http: HttpClient) { }

  getUserData(Id) : Observable<UserDetails>{
    return this.http.get<UserDetails>("/api/users/getusers/"+Id).map(res=> new UserDetails(res));
  }
  getUserFriends(Id) : Observable<Array<Friend>>{
    return this.http.get<Friend[]>("/api/users/getfriends/"+Id).map((entries : any[]) => entries.map((e)=> new Friend(e)));
  }
  getFriend(UserId) : Observable<Friend>{
    return this.http.get<Friend>("/api/users/getusers/"+UserId).map((res:Friend) => new Friend(res));
  }
  getUserFriendInvitations(Id) : Observable<Invitation[]>{
    return this.http.get<Array<Invitation>>("/api/users/getinvitations/"+Id).map((entries:any[])=> entries.map(e => new Invitation(e)));
  }
  searchUsers(searchphrase) : Observable<UserSearch[]>{
    return this.http.get<Array<UserSearch>>('/api/users/search',
     {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: { phrase : searchphrase }
     },
     ).map((entrise:UserSearch[])=> entrise.map(e=> new UserSearch(e)));
  }
  changefollowFriend(Friend: Friend, id: any, arg2: boolean): any {
    var fid = Friend.Id;
    return this.http.post("/api/users/changefollowstatus", null, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: {
        "FriendId" : JSON.stringify(fid),
        "UserId" : JSON.stringify(id),
        "Follow" : JSON.stringify(arg2)
      }
    });
  }

  inviteUser(UserId, targetUserId){
    var inv = new Invitation({});
    inv.Status = 0;
    inv.TargetPersonId = targetUserId;
    inv.UserId = UserId;
    return this.http.post("/api/users/sendinvitation", JSON.stringify(inv)).map((r:Invitation) => new Invitation(r));
  }
  acceptInvitation(InvitationId, accept){ // accept ye/no
      return this.http.post("/api/users/makefriend", null, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        params: {
          "InvitationId" : JSON.stringify(InvitationId),
          "accept" : JSON.stringify(accept)
        }
      });
  }


}
