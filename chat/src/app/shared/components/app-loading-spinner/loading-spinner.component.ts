import { Component, OnInit, signal } from "@angular/core";
import { LoadingSpinnerService } from "./loading-spinner.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-loading-spinner",
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  standalone: false
})

export class LoadingSpinnerComponent {
  constructor(){}
}
