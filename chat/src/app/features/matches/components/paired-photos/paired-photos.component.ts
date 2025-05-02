import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AccountService } from 'src/app/features/account/services/account.service';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { take } from 'rxjs';

@Component({
  selector: 'app-paired-photos',
  templateUrl: './paired-photos.component.html',
  styleUrls: ['./paired-photos.component.scss'],
  standalone: false,
})
export class PairedPhotosComponent implements OnChanges {
  @Input() matchedAvatar: string | null = null;
  hostUserPhoto: string | null = null;
  constructor(private accountService: AccountService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    this.subscribeToHostProfile();
  }

  private subscribeToHostProfile() {
   this.accountService.getHostUserPhoto.pipe(take(1)).subscribe((avatar) => {
      this.hostUserPhoto = StringUtils.getAvatarUrl(avatar);
      if (!this.matchedAvatar) this.matchedAvatar = StringUtils.getAvatarUrl(this.matchedAvatar)
    });
  }
}
