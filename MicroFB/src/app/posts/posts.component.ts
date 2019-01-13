import { Component, OnInit } from '@angular/core';
import { PostsService } from '../DataServices/posts.service';
import { SocketService } from '../DataServices/socket.service';
import { Post } from '../Models/post';
import { FriendsListService } from '../DataServices/friends-list.service';
import { Friend } from '../Models/friend';
import { Like } from '../Models/like';
import { NotificationsServiceService } from '../DataServices/notifications-service.service';
import { Notifications } from '../Models/notifications';

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
    private notificationsService : NotificationsServiceService,
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
  get User(){
    return JSON.parse(localStorage.getItem("UserData"));
  }

  likePost(postId){
    this.postsService.likePost(postId, this.getUserId).subscribe(((like: Like)=>{
        this.BoardData.filter(obj => {return obj.Id === like.PostId } ).forEach(o => {
          o.Likes.push(like);
          // SEND NOTIFICATION TO AUTHOR
          var n = new Notifications({});
          n.SourcePersonId = this.getUserId;
          n.TargetPersonId = o.AuthorId;
          n.Type = 3;
          n.Shown = false;
          n.Description = this.User.FirstName + " " + this.User.LastName + " polubił twój post.";
          this.notificationsService.sendNotification(n).subscribe((x:Notifications)=> {
              // SEND SOCKET SERVER INFO ABOUT NOTIFICATION

              this.socketService.SendNotification(x);
          });
          // SEND SOCKET SERVER INFO ABOUT LIKE TO OTHER PPL
          this.socketService.SendLike(like);
        });
    }));
  }
  unlikePost(postId){
    var like = this.BoardData.find(x=> x.Id === postId).Likes.find(z=> z.UserId == this.getUserId); // Znajdz mojego lajka
    this.postsService.unlikePost(like.Id).subscribe(()=>{
      let x = this.BoardData.find(x=> x.Id === postId);
      x.Likes = x.Likes.filter(x=> {return x.Id !== like.Id }); // usuń z lokalnej listy
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
    this.socketService.Likes.subscribe((x:Like) =>{
      this.BoardData.find(p => p.Id === x.PostId).Likes.push(x);
    });
  }
}
