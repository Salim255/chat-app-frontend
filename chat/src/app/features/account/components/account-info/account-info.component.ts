import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from 'src/app/core/services/media/photo.service';
import { StringUtils } from 'src/app/shared/utils/string-utils';

export type AccountInfoData = {
  city: string;
  avatar: string | null;
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

  onEditProfile(): void {
    this.router.navigate(['/tabs/edit-profile']);
  }

  async onTakePhoto(): Promise<void>{
    const base64String = await this.photoService.takePicture();

    if (base64String) {
      // Handle photo upload logic
      // This Ensure the base64String is in the correct format for displaying in an image tag
      this.photoPreview = `data:image/jpeg;base64,${base64String}`;
      this.selectedPhotoString = base64String;
    }
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
    const accountAvatar = StringUtils.getAvatarUrl(this.accountInfoData?.avatar ?? null);
    return accountAvatar;
  }
}
