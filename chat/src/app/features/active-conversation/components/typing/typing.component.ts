import { Component, Input} from "@angular/core";

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.scss']
})

export class TypingComponent  {
  @Input() typingState: any;
  constructor(){}

}
