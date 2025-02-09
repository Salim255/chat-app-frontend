import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-deletion',
  templateUrl: './account-deletion.component.html',
  styleUrls: ['./account-deletion.component.scss'],
  standalone: false
})

export class AccountDeletionComponent implements OnInit {
    constructor(){}

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      console.log('From deletion account')
    }
}
