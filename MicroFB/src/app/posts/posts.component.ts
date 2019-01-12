import { Component, OnInit } from '@angular/core';
import { PostsService } from '../DataServices/posts.service';
import { SocketService } from '../DataServices/socket.service';
import { Post } from '../Models/post';
import { FriendsListService } from '../DataServices/friends-list.service';
import { Friend } from '../Models/friend';
import { Like } from '../Models/like';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  FriendsList : Array<Friend> = [];
  BoardData : Array<Post> = []; // Tutaj przechowywane są posty z mojej lub aktualnie przeglądanego użytkownika tablicy!
  postModel = new Post(new Object());

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

  }

  saveNewPost(e){
    var post = new Post({});
    post.AuthorId = this.getUserId;
    post.Content = e.target[0].value;

    this.postsService.savePost(post).subscribe(PostId => {
        this.getPost(PostId);
        post.Id = parseInt(JSON.stringify(PostId));
        this.socketService.SendNewPost(post);
    });
  }

  getPost(PostId){
    this.postsService.getPost(PostId).subscribe(post=>{
      this.BoardData.push(post);
    })
  }
  get getUserId(){
    return parseInt(localStorage.getItem("UserId"));
  }

  likePost(postId){
    this.postsService.likePost(postId, this.getUserId).subscribe(((x: Like)=>{
        this.BoardData.filter(obj => {return obj.Id === x.PostId } ).forEach(o => {
          o.Likes.push(x);
          // SEND SOCKET SERVER INFO ABOUT LIKE TO OTHER PPL
          // SEND NOTIFICATION TO AUTHOR
        });
    }));
  }
  unlikePost(postId){
    var like = this.BoardData.find(x=> x.Id === postId).Likes.find(z=> z.UserId == this.getUserId); // Znajdz mojego lajka
    this.postsService.unlikePost(like.Id).subscribe(()=>{
      let x = this.BoardData.find(x=> x.Id === postId);
      x.Likes.filter(x=> {return x.Id !== like.Id }); // usuń z lokalnej listy
    });
  }

  ngOnInit() {
    this.FriendsListService.FriendList.subscribe(fl =>{
      this.FriendsList = fl;
    });
    this.socketService.Posts.subscribe(data => {
      data = JSON.parse(data);
      if(data.UserId){
      var control = this.FriendsList.filter(obj=> {return obj.Id === data.UserId});
        if(control.length > 0 ){
          var friend = control.pop();
          console.dir(friend);
          if(friend.Observing === true){ // Jeśli go obserwuję pobierz post jego nowy post :)
            console.log("test");
            this.getPost(data.PostId);
          }
        }
      }
    });
  }
}
