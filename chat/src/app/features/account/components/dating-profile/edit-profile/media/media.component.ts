import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { StringUtils } from "src/app/shared/utils/string-utils";

@Component({
  selector: 'app-edit-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  standalone: false,
})
export class MediaComponent implements OnChanges {
  @Input() photos: string [] = [];
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['photos'] && changes['photos'].currentValue) {
      this.photos = this.setUserImages();
    }
  }
  onBack(): void {
    //this.location.back()
  }
   trackByIndex(index: number): number {
    return index;
  }

  setUserImages(): string[] {
    const imagesList = [
      StringUtils.getAvatarUrl(this.photos[0]),
      StringUtils.getAvatarUrl(this.photos[1]),
      StringUtils.getAvatarUrl(this.photos[2]),
      StringUtils.getAvatarUrl(this.photos[3])
    ];
    return imagesList;
  }
}
