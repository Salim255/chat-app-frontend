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
export class PairedPhotosComponent {
  @Input() matchedAvatar!: string ;
  @Input() hostUserPhoto!: string ;
  constructor() {}
}
