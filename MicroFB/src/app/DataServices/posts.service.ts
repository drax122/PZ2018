import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {Invitation } from '../Models/Invitation';
import { Post } from '../Models/post';
import { HomeComponent } from '../home/home.component';
import { SocketService } from './socket.service';
import { Like } from '../Models/like';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  
  constructor(private http: HttpClient, private socketService: SocketService) { }

  getUserBoard(Id) : Observable<Post[]>{
    return this.http.get<Array<Post>>("/api/posts/getboard/"+Id).map((entries:any[])=> entries.map(e=> new Post(e)));
  }
  getFriendBoard(UserId) : Observable<Post[]>{
    return this.http.get<Array<Post>>("/api/posts/getuserboard/"+UserId).map((entries:any[])=> entries.map(e=> new Post(e)));;
  }
  getPost(PostId): Observable<Post>{
    return this.http.get<Post>("/api/posts/getpost/"+PostId).map((res:Post) => new Post(res));
  }
  savePost(post : Post){ // Zwraca Id nowego posta, o którym warto powiadomić znajomych.
    console.dir(post);
    return this.http.post("/api/posts/savepost", JSON.stringify(post));
  }
  editPost(post : Post){ // Dunno czy warto powiadamiać znajomych o edycji posta na żywo?
    return this.http.post("/api/posts/savepost", JSON.stringify(post));
  }
  sharePost(PostId, UserId){ // UserId - id zalogowanego użytkownika (mnie)
    return this.http.post("/api/posts/sharepost", null, { // Zwraca ID nowego posta, o któym warto powiadomić znajomych
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: {
        "UserId" : UserId,
        "PostId" : PostId
      }
    });
  }
  likePost(postId: any, getUserId: number): Observable<Like> {
    return this.http.post("/api/posts/likepost", null, { // Zwraca ID nowego posta, o któym warto powiadomić znajomych
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: {
        "UserId" : JSON.stringify(postId),
        "PostId" : JSON.stringify(getUserId)
      }
    }).map((x:any) => new Like(x));
  }
  unlikePost(likeId){
    return this.http.post("/api/posts/savepost", null, 
    {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: {
        "LikeId" : likeId,
      }
    });
  }
}
