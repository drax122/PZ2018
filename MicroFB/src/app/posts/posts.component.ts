import { Component, OnInit } from '@angular/core';
import { PostsService } from '../DataServices/posts.service';
import { SocketService } from '../DataServices/socket.service';
import { Post } from '../Models/post';
import { FriendsListService } from '../DataServices/friends-list.service';
import { Friend } from '../Models/friend';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  FriendsList : Array<Friend> = [];
  BoardData : Array<Post> = []; // Tutaj przechowywane są posty z mojej lub aktualnie przeglądanego użytkownika tablicy!
  
  constructor(
    private postsService : PostsService, 
    private socketService : SocketService,
    private FriendsListService : FriendsListService) 
  {
    // LOAD POSTS
    this.postsService.getUserBoard(this.getUserId).subscribe(data=>{
      this.BoardData = data;
      console.log("BOARD LOADED:");
      console.dir(this.BoardData);
    });
    // TO DO
    // SOCKETY Z NOWYMI POSTAMI ZNAJOMYCH/MOIMI I ICH POBIERANIEM
    

  }

  saveNewPost(msg){
    var post = new Post({});
    post.AuthorId = this.getUserId;
    post.Content = msg;
    
    this.postsService.savePost(post).subscribe(PostId => {
        this.getPost(PostId);
    });
  }

  getPost(PostId){
    this.postsService.getPost(PostId).subscribe(post=>{
      console.log("GOT NEW POST FROM DB");
      this.BoardData.push(post);
    })
  }

  get getUserId(){
    return parseInt(localStorage.getItem("UserId"));
  }

  ngOnInit() {
    this.FriendsListService.FriendList.subscribe(fl =>{
      this.FriendsList = fl;
      console.log("Komponent postów załadował do pamięci listę znajomych");
      console.dir(fl);
    });
  }

}
