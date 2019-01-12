import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {Invitation } from '../Models/Invitation';
import { Post } from '../Models/post';
import { HomeComponent } from '../home/home.component';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private http: HttpClient) { }

  getUserBoard(Id) : Observable<Post[]>{
    return this.http.get<Array<Post>>("/api/posts/getboard/"+Id);
  }
  getFriendBoard(UserId) : Observable<Post[]>{
    return this.http.get<Array<Post>>("/api/posts/getuserboard/"+UserId);
  }

  getPost(PostId): Observable<Post>{
    return this.http.get<Post>("/api/posts/getpost/"+PostId);
  }

  savePost(post : Post){ // Zwraca Id nowego posta, o którym warto powiadomić znajomych.
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
}
