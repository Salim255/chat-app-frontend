import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { AccountService } from 'src/app/features/account/services/account.service';
import { Subscription } from 'rxjs';
import { StringUtils } from 'src/app/shared/utils/string-utils';

@Component({
  selector: 'app-paired-photos',
  templateUrl: './paired-photos.component.html',
  styleUrls: ['./paired-photos.component.scss'],
  standalone: false,
})
export class PairedPhotosComponent implements OnChanges, OnDestroy {
  @Input() matchedProfile!: Partner;

  hostUserPhoto: string | null = null;
  private hostProfileSubscription!: Subscription;

  constructor(private accountService: AccountService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.subscribeToHostProfile();
  }

  private subscribeToHostProfile() {
    this.hostProfileSubscription = this.accountService.getHostUserPhoto.subscribe((avatar) => {
      this.hostUserPhoto = StringUtils.getAvatarUrl(avatar);
    });
  }

  ngOnDestroy(): void {
    this.hostProfileSubscription?.unsubscribe();
  }
}
