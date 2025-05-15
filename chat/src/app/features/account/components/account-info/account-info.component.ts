import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from 'src/app/core/services/media/photo.service';
import { StringUtils } from 'src/app/shared/utils/string-utils';

export type AccountInfoData = {
  city: string;
  photos: string [];
  age: number;
  name: string;
}

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
  standalone: false,
})
export class AccountInfoComponent {
  @Input() accountInfoData: AccountInfoData | null = null ;
  selectedPhotoString: string | null = null;
  photoPreview: string | ArrayBuffer | null = null;

  constructor( private router: Router, private photoService: PhotoService) {}

  onProfile(): void {
    //this.router.navigate(['/tabs/edit-profile']);
    this.router.navigate(['/tabs/account/dating-profile']);
  }

  onPreferences(): void{
    this.router.navigate(['/tabs/account/preferences']);
  }

  onSubmit(): void {
    if (!this.selectedPhotoString) {
      return;
    }
    // Reset form
    this.selectedPhotoString = null;
    this.photoPreview = null;
  }

  setAccountImage(): string {
    const accountAvatar = StringUtils.getAvatarUrl(this.accountInfoData?.photos[0] ?? null);
    return accountAvatar;
  }
}
