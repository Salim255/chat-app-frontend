import { Component, Input } from "@angular/core";

@Component({
    selector: "app-tag",
    templateUrl: "./tag.component.html",
    styleUrls: ["./tag.component.scss"],
    standalone: false
})
export class TagComponent {
  @Input() message!: string;

}
