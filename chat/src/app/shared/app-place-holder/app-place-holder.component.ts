import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-place-holder',
  templateUrl: './app-place-holder.component.html',
  styleUrls: ['./app-place-holder.component.scss']
})
export class AppPlaceHolderComponent implements OnInit {

 constructor(private router: Router) {}

 ngOnInit(): void {
  console.log("Hello world");
 }

 onExplore() {
  this.router.navigate(['tabs/community']);
}
}
