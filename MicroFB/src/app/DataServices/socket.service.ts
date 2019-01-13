import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { Post } from '../Models/post';
import { Invitation } from '../Models/Invitation';
import { Notifications } from '../Models/notifications';
import { Like } from '../Models/like';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  Connect : Subject<any>; // Logujemy się - powiadamiamy innych, i dostajemy listę zalogowanych
  Disconnect : Subject<any>; // wylogujemy się - powiadamiamy innych
  Status : Subject<any>; // ktoś się zalogował - przychodzi nam jego ID i możemy się wylogować za pomocą next here
  Messages : Subject<any>; // chcemy wysłać wiadomość/otrzymujemy nową wiadomość
  Invitations : Subject<any>; // wysyłamy/odbioramy wiadomość o tym, że użytkownik zaakceptował zaproszenie
  Posts : Subject<any>;
  SendInvitation : Subject<any>;
  Notifications : Subject<any>; // Wysyłamy/odbieramy notyfikacje
  Likes : Subject<any>;

  constructor(private ws: WebsocketService) {
    this.Connect = <Subject<any>>ws.connect().map((response:any): any =>{
      return response;
    });
    this.Status = <Subject<any>>ws.status().map((response:any): any =>{
      return response;
    });
    this.Messages = <Subject<any>>ws.Messages().map((response:any): any =>{
      return response;
    });
    this.Invitations = <Subject<any>>ws.Invitations().map((response:any): any =>{
      return new Invitation(response);
    });
    this.Disconnect = <Subject<any>>ws.disconnect().map((response:any): any =>{
      return response;
    });
    this.Posts = <Subject<any>>ws.Posts().map((response:any): any =>{
      return response;
    });
    this.SendInvitation = <Subject<any>>ws.SendInvitation().map((response:any): any =>{
      return new Invitation(response);
    });
    this.Notifications = <Subject<any>>ws.Notifications().map((response:any): any =>{
      return new Notifications(response);
    });
    this.Likes = <Subject<any>>ws.Notifications().map((response:any): any =>{
      return new Like(response);
    });
  }

  SendLike(like:Like){
    this.Likes.next(like);
  }

  SendNotification(Not:Notifications){
    this.Notifications.next(Not);
  }

  SendNewPost(Post:Post){
    this.Posts.next({"PostId": Post.Id, "UserId": Post.AuthorId});
  }

  AcceptInvitation(Invitation:Invitation){
    this.Invitations.next(Invitation);
  }
  SendInv(Inv:Invitation){
    this.SendInvitation.next(Inv);
  }
  Imonline(UserId){
    this.Connect.next(UserId);
  }
  Logout(UserId){
    this.Disconnect.next(UserId);
  }
  SendMsg(msg){
    this.Messages.next(msg);
  }
}
