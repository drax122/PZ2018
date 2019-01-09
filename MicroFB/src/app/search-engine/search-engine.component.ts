import { Component, OnInit } from '@angular/core';
import { UserDataServiceService } from '../DataServices/user-data-service.service';
import { UserSearch } from '../Models/user-search';

@Component({
  selector: 'app-search-engine',
  templateUrl: './search-engine.component.html',
  styleUrls: ['./search-engine.component.css']
})
export class SearchEngineComponent implements OnInit {
  SearchPhrase = "";
  SearchResults : Array<UserSearch> = [];
  constructor(private UserDataService : UserDataServiceService,) { }

  updateSearchString(e){
    console.log(e);
    this.SearchPhrase = e.target.value;
    this.search();
  }

  search(){
    this.UserDataService.searchUsers(this.SearchPhrase).subscribe(data=>{
      this.SearchResults.splice(0, this.SearchResults.length);
      data.forEach(element => {
        this.SearchResults.push(new UserSearch(element));
      });
      console.log("SearchResults");
      console.dir(this.SearchResults);
    });
  }

  inviteUser(TargetUserId){
    this.UserDataService.inviteUser(localStorage.getItem("UserId"),TargetUserId).subscribe(
      (data) => {
        console.log("Server : invitation response:");
        console.log(data);
        // WYSLIJ INFO DO SERWERA SOCKETOW, SPRAWDZ CZY ZAPRASZANY UZYTKOWNIK JEST ONLINE WYSWIETL MU ZAPROSZENIE
      }
    );
  }

  ngOnInit() {
  }

}
