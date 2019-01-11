import { Component, OnInit } from '@angular/core';
import { PostsService } from '../DataServices/posts.service';
import { SocketService } from '../DataServices/socket.service';
import { Post } from '../Models/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  BoardData : Array<Post> = []; // Tutaj przechowywane są posty z mojej lub aktualnie przeglądanego użytkownika tablicy!
  
  constructor(private postsService : PostsService, private socketService : SocketService) 
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


  

  get getUserId(){
    return parseInt(localStorage.getItem("UserId"));
  }

  ngOnInit() {

  }

}
